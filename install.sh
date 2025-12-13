#!/bin/bash

# Кольори для виводу
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}╔════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  Elementor Block Generator - Linux Installer  ║${NC}"
echo -e "${GREEN}╔════════════════════════════════════════════════╗${NC}"
echo ""

# Функція для перевірки успішності команди
check_success() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ $1${NC}"
    else
        echo -e "${RED}✗ Помилка: $1${NC}"
        exit 1
    fi
}

# Перевірка наявності Node.js
echo -e "${YELLOW}[1/7] Перевірка Node.js...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓ Node.js вже встановлено: $NODE_VERSION${NC}"
else
    echo -e "${YELLOW}Node.js не знайдено. Встановлюю...${NC}"
    
    # Визначення дистрибутиву Linux
    if [ -f /etc/debian_version ]; then
        # Debian/Ubuntu
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt-get install -y nodejs
    elif [ -f /etc/redhat-release ]; then
        # RHEL/CentOS/Fedora
        curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
        sudo yum install -y nodejs
    elif [ -f /etc/arch-release ]; then
        # Arch Linux
        sudo pacman -S nodejs npm
    else
        echo -e "${RED}Не вдалось визначити дистрибутив Linux. Встановіть Node.js вручну: https://nodejs.org/${NC}"
        exit 1
    fi
    
    check_success "Node.js встановлено"
fi

# Перевірка наявності pnpm
echo -e "${YELLOW}[2/7] Перевірка pnpm...${NC}"
if command -v pnpm &> /dev/null; then
    PNPM_VERSION=$(pnpm -v)
    echo -e "${GREEN}✓ pnpm вже встановлено: $PNPM_VERSION${NC}"
else
    echo -e "${YELLOW}pnpm не знайдено. Встановлюю...${NC}"
    npm install -g pnpm
    check_success "pnpm встановлено"
fi

# Перевірка наявності MySQL
echo -e "${YELLOW}[3/7] Перевірка MySQL...${NC}"
if command -v mysql &> /dev/null; then
    MYSQL_VERSION=$(mysql --version)
    echo -e "${GREEN}✓ MySQL вже встановлено: $MYSQL_VERSION${NC}"
else
    echo -e "${YELLOW}MySQL не знайдено.${NC}"
    read -p "Встановити MySQL? (y/n): " install_mysql
    if [[ $install_mysql == "y" || $install_mysql == "Y" ]]; then
        if [ -f /etc/debian_version ]; then
            sudo apt-get update
            sudo apt-get install -y mysql-server
            sudo systemctl start mysql
            sudo systemctl enable mysql
        elif [ -f /etc/redhat-release ]; then
            sudo yum install -y mysql-server
            sudo systemctl start mysqld
            sudo systemctl enable mysqld
        elif [ -f /etc/arch-release ]; then
            sudo pacman -S mysql
            sudo systemctl start mysqld
            sudo systemctl enable mysqld
        fi
        check_success "MySQL встановлено"
    else
        echo -e "${YELLOW}⚠ MySQL не встановлено. Вам потрібно налаштувати базу даних вручну.${NC}"
    fi
fi

# Встановлення залежностей проекту
echo -e "${YELLOW}[4/7] Встановлення залежностей проекту...${NC}"
pnpm install
check_success "Залежності встановлено"

# Створення .env файлу
echo -e "${YELLOW}[5/7] Налаштування .env файлу...${NC}"
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
        echo -e "${GREEN}✓ Файл .env створено з .env.example${NC}"
        
        echo -e "${YELLOW}Налаштуйте .env файл з вашими параметрами:${NC}"
        read -p "Введіть DATABASE_URL (або натисніть Enter для mysql://root:@localhost:3306/elementor_blocks): " db_url
        db_url=${db_url:-mysql://root:@localhost:3306/elementor_blocks}
        
        read -p "Введіть JWT_SECRET (або натисніть Enter для генерації випадкового): " jwt_secret
        if [ -z "$jwt_secret" ]; then
            jwt_secret=$(openssl rand -base64 32)
        fi
        
        # Оновлення .env файлу
        sed -i "s|DATABASE_URL=.*|DATABASE_URL=$db_url|g" .env
        sed -i "s|JWT_SECRET=.*|JWT_SECRET=$jwt_secret|g" .env
        
        echo -e "${GREEN}✓ .env файл налаштовано${NC}"
    else
        echo -e "${RED}✗ Файл .env.example не знайдено${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ Файл .env вже існує${NC}"
fi

# Створення бази даних
echo -e "${YELLOW}[6/7] Налаштування бази даних...${NC}"
read -p "Запустити міграції бази даних? (y/n): " run_migrations
if [[ $run_migrations == "y" || $run_migrations == "Y" ]]; then
    # Завантаження змінних з .env
    export $(grep -v '^#' .env | xargs)
    pnpm db:push
    check_success "Міграції виконано"
else
    echo -e "${YELLOW}⚠ Міграції пропущено. Запустіть 'pnpm db:push' вручну.${NC}"
fi

# Запуск проекту
echo -e "${YELLOW}[7/7] Запуск проекту...${NC}"
echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║         Встановлення завершено успішно!        ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Для запуску проекту виконайте:${NC}"
echo -e "${GREEN}  pnpm dev${NC}    - режим розробки"
echo -e "${GREEN}  pnpm build${NC}  - збірка для продакшену"
echo -e "${GREEN}  pnpm start${NC}  - запуск продакшен версії"
echo ""

read -p "Запустити проект зараз у режимі розробки? (y/n): " start_now
if [[ $start_now == "y" || $start_now == "Y" ]]; then
    echo -e "${GREEN}Запускаю проект...${NC}"
    echo -e "${YELLOW}Проект буде доступний за адресою: http://localhost:3000${NC}"
    echo -e "${YELLOW}Для зупинки натисніть Ctrl+C${NC}"
    echo ""
    pnpm dev
else
    echo -e "${GREEN}Готово! Запустіть проект командою 'pnpm dev'${NC}"
fi
