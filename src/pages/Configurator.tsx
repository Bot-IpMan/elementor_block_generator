import React, { useState, useCallback, useMemo } from 'react';
import {
  Container,
  Grid,
  Paper,
  TextField,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Chip,
  Stack,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ColorPicker,
  Slider,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Preview as PreviewIcon,
  Download as DownloadIcon,
  Copy as CopyIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

interface BlockProperty {
  id: string;
  name: string;
  type: 'text' | 'number' | 'color' | 'select' | 'boolean' | 'slider' | 'textarea';
  label: string;
  value: any;
  defaultValue?: any;
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  description?: string;
}

interface BlockStyle {
  id: string;
  name: string;
  properties: {
    padding?: string;
    margin?: string;
    backgroundColor?: string;
    borderRadius?: string;
    boxShadow?: string;
    borderColor?: string;
    borderWidth?: string;
    borderStyle?: string;
    opacity?: number;
    [key: string]: any;
  };
}

interface BlockConfig {
  id: string;
  name: string;
  category: string;
  description: string;
  properties: BlockProperty[];
  styles: BlockStyle[];
  responsiveBreakpoints: {
    mobile: Partial<BlockStyle>;
    tablet: Partial<BlockStyle>;
    desktop: Partial<BlockStyle>;
  };
  advanced: {
    customCSS?: string;
    customJS?: string;
    animationEnabled?: boolean;
    animationType?: string;
    animationDuration?: number;
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const Configurator: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedBreakpoint, setSelectedBreakpoint] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [openPropertyDialog, setOpenPropertyDialog] = useState(false);
  const [openStyleDialog, setOpenStyleDialog] = useState(false);
  const [editingProperty, setEditingProperty] = useState<BlockProperty | null>(null);
  const [editingStyle, setEditingStyle] = useState<BlockStyle | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const [blockConfig, setBlockConfig] = useState<BlockConfig>({
    id: 'block_' + Date.now(),
    name: 'Custom Block',
    category: 'General',
    description: 'A custom block configuration',
    properties: [
      {
        id: 'prop_1',
        name: 'title',
        type: 'text',
        label: 'Block Title',
        value: 'Welcome to My Block',
        placeholder: 'Enter block title',
        required: true,
        description: 'The main title of the block',
      },
    ],
    styles: [
      {
        id: 'style_1',
        name: 'Default Style',
        properties: {
          padding: '20px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderColor: '#e0e0e0',
          borderWidth: '1px',
          borderStyle: 'solid',
          opacity: 1,
        },
      },
    ],
    responsiveBreakpoints: {
      mobile: { properties: { padding: '10px' } },
      tablet: { properties: { padding: '15px' } },
      desktop: { properties: { padding: '20px' } },
    },
    advanced: {
      customCSS: '',
      customJS: '',
      animationEnabled: false,
      animationType: 'fadeIn',
      animationDuration: 300,
    },
  });

  const [propertyForm, setPropertyForm] = useState<Partial<BlockProperty>>({
    type: 'text',
    required: false,
  });

  const [styleForm, setStyleForm] = useState<Partial<BlockStyle>>({
    properties: {},
  });

  // Handle block config updates
  const handleBlockConfigChange = useCallback(
    (field: keyof BlockConfig, value: any) => {
      setBlockConfig((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  // Property management
  const handleAddProperty = () => {
    setEditingProperty(null);
    setPropertyForm({ type: 'text', required: false });
    setOpenPropertyDialog(true);
  };

  const handleEditProperty = (property: BlockProperty) => {
    setEditingProperty(property);
    setPropertyForm(property);
    setOpenPropertyDialog(true);
  };

  const handleSaveProperty = () => {
    if (!propertyForm.name || !propertyForm.label) {
      alert('Please fill in required fields: Name and Label');
      return;
    }

    const newProperty: BlockProperty = {
      id: propertyForm.id || 'prop_' + Date.now(),
      name: propertyForm.name!,
      type: propertyForm.type || 'text',
      label: propertyForm.label!,
      value: propertyForm.value || propertyForm.defaultValue || '',
      defaultValue: propertyForm.defaultValue,
      placeholder: propertyForm.placeholder,
      options: propertyForm.options,
      min: propertyForm.min,
      max: propertyForm.max,
      step: propertyForm.step,
      required: propertyForm.required,
      description: propertyForm.description,
    };

    setBlockConfig((prev) => {
      if (editingProperty) {
        return {
          ...prev,
          properties: prev.properties.map((p) => (p.id === editingProperty.id ? newProperty : p)),
        };
      } else {
        return {
          ...prev,
          properties: [...prev.properties, newProperty],
        };
      }
    });

    setOpenPropertyDialog(false);
    setPropertyForm({});
  };

  const handleDeleteProperty = (propertyId: string) => {
    setBlockConfig((prev) => ({
      ...prev,
      properties: prev.properties.filter((p) => p.id !== propertyId),
    }));
  };

  // Style management
  const handleAddStyle = () => {
    setEditingStyle(null);
    setStyleForm({ properties: {} });
    setOpenStyleDialog(true);
  };

  const handleEditStyle = (style: BlockStyle) => {
    setEditingStyle(style);
    setStyleForm(style);
    setOpenStyleDialog(true);
  };

  const handleSaveStyle = () => {
    if (!styleForm.name) {
      alert('Please enter a style name');
      return;
    }

    const newStyle: BlockStyle = {
      id: styleForm.id || 'style_' + Date.now(),
      name: styleForm.name!,
      properties: styleForm.properties || {},
    };

    setBlockConfig((prev) => {
      if (editingStyle) {
        return {
          ...prev,
          styles: prev.styles.map((s) => (s.id === editingStyle.id ? newStyle : s)),
        };
      } else {
        return {
          ...prev,
          styles: [...prev.styles, newStyle],
        };
      }
    });

    setOpenStyleDialog(false);
    setStyleForm({});
  };

  const handleDeleteStyle = (styleId: string) => {
    setBlockConfig((prev) => ({
      ...prev,
      styles: prev.styles.filter((s) => s.id !== styleId),
    }));
  };

  // Export configuration
  const handleExportConfig = () => {
    const json = JSON.stringify(blockConfig, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `block-config-${blockConfig.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Copy to clipboard
  const handleCopyConfig = () => {
    const json = JSON.stringify(blockConfig, null, 2);
    navigator.clipboard.writeText(json);
    alert('Configuration copied to clipboard!');
  };

  // Responsive style updater
  const handleUpdateResponsiveStyle = (breakpoint: 'mobile' | 'tablet' | 'desktop', key: string, value: any) => {
    setBlockConfig((prev) => ({
      ...prev,
      responsiveBreakpoints: {
        ...prev.responsiveBreakpoints,
        [breakpoint]: {
          ...prev.responsiveBreakpoints[breakpoint],
          properties: {
            ...prev.responsiveBreakpoints[breakpoint].properties,
            [key]: value,
          },
        },
      },
    }));
  };

  // Advanced settings updater
  const handleUpdateAdvanced = (key: keyof BlockConfig['advanced'], value: any) => {
    setBlockConfig((prev) => ({
      ...prev,
      advanced: {
        ...prev.advanced,
        [key]: value,
      },
    }));
  };

  // Generate preview styles
  const previewStyles = useMemo(() => {
    const defaultStyle = blockConfig.styles[0];
    if (!defaultStyle) return {};
    return {
      ...defaultStyle.properties,
    };
  }, [blockConfig.styles]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Block Configurator
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant={previewMode ? 'contained' : 'outlined'}
            startIcon={<PreviewIcon />}
            onClick={() => setPreviewMode(!previewMode)}
          >
            {previewMode ? 'Edit' : 'Preview'}
          </Button>
          <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExportConfig}>
            Export
          </Button>
          <Button variant="outlined" startIcon={<CopyIcon />} onClick={handleCopyConfig}>
            Copy
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        {/* Main Configuration Panel */}
        <Grid item xs={12} md={previewMode ? 6 : 8}>
          <Card>
            <CardHeader
              title="Configuration"
              avatar={<SettingsIcon />}
              action={
                <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
                  <Tab label="Basic" id="tab-0" aria-controls="tabpanel-0" />
                  <Tab label="Properties" id="tab-1" aria-controls="tabpanel-1" />
                  <Tab label="Styles" id="tab-2" aria-controls="tabpanel-2" />
                  <Tab label="Responsive" id="tab-3" aria-controls="tabpanel-3" />
                  <Tab label="Advanced" id="tab-4" aria-controls="tabpanel-4" />
                </Tabs>
              }
            />
            <Divider />
            <CardContent>
              {/* Basic Tab */}
              <TabPanel value={tabValue} index={0}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Block ID"
                    value={blockConfig.id}
                    onChange={(e) => handleBlockConfigChange('id', e.target.value)}
                    disabled
                    helperText="Auto-generated unique identifier"
                  />
                  <TextField
                    fullWidth
                    label="Block Name"
                    value={blockConfig.name}
                    onChange={(e) => handleBlockConfigChange('name', e.target.value)}
                    required
                  />
                  <TextField
                    fullWidth
                    label="Category"
                    value={blockConfig.category}
                    onChange={(e) => handleBlockConfigChange('category', e.target.value)}
                    placeholder="e.g., General, Header, Footer"
                  />
                  <TextField
                    fullWidth
                    label="Description"
                    value={blockConfig.description}
                    onChange={(e) => handleBlockConfigChange('description', e.target.value)}
                    multiline
                    rows={3}
                    placeholder="Describe what this block does"
                  />
                </Stack>
              </TabPanel>

              {/* Properties Tab */}
              <TabPanel value={tabValue} index={1}>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Block Properties</Typography>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddProperty} size="small">
                      Add Property
                    </Button>
                  </Box>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Label</TableCell>
                          <TableCell>Required</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {blockConfig.properties.map((property) => (
                          <TableRow key={property.id}>
                            <TableCell>{property.name}</TableCell>
                            <TableCell>
                              <Chip label={property.type} size="small" variant="outlined" />
                            </TableCell>
                            <TableCell>{property.label}</TableCell>
                            <TableCell>{property.required ? '✓' : '✗'}</TableCell>
                            <TableCell align="right">
                              <IconButton
                                size="small"
                                onClick={() => handleEditProperty(property)}
                                title="Edit"
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteProperty(property.id)}
                                title="Delete"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Stack>
              </TabPanel>

              {/* Styles Tab */}
              <TabPanel value={tabValue} index={2}>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Predefined Styles</Typography>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddStyle} size="small">
                      Add Style
                    </Button>
                  </Box>
                  {blockConfig.styles.map((style) => (
                    <Accordion key={style.id}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              backgroundColor: style.properties.backgroundColor || 'white',
                              border: '1px solid #ccc',
                              borderRadius: '4px',
                            }}
                          />
                          <Typography>{style.name}</Typography>
                          <Box sx={{ ml: 'auto' }}>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditStyle(style);
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteStyle(style.id);
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Stack spacing={2}>
                          {Object.entries(style.properties).map(([key, value]) => (
                            <TextField
                              key={key}
                              fullWidth
                              label={key.replace(/([A-Z])/g, ' $1').trim()}
                              value={value || ''}
                              size="small"
                              onChange={(e) => {
                                const updatedStyles = blockConfig.styles.map((s) =>
                                  s.id === style.id
                                    ? {
                                        ...s,
                                        properties: { ...s.properties, [key]: e.target.value },
                                      }
                                    : s
                                );
                                setBlockConfig((prev) => ({ ...prev, styles: updatedStyles }));
                              }}
                            />
                          ))}
                        </Stack>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Stack>
              </TabPanel>

              {/* Responsive Tab */}
              <TabPanel value={tabValue} index={3}>
                <Stack spacing={3}>
                  <FormControl fullWidth>
                    <InputLabel>Breakpoint</InputLabel>
                    <Select
                      value={selectedBreakpoint}
                      onChange={(e) => setSelectedBreakpoint(e.target.value as 'mobile' | 'tablet' | 'desktop')}
                      label="Breakpoint"
                    >
                      <MenuItem value="mobile">Mobile (< 600px)</MenuItem>
                      <MenuItem value="tablet">Tablet (600px - 960px)</MenuItem>
                      <MenuItem value="desktop">Desktop (> 960px)</MenuItem>
                    </Select>
                  </FormControl>

                  <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h6">Padding</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TextField
                        fullWidth
                        label="Padding (e.g., 10px, 15px 20px)"
                        value={blockConfig.responsiveBreakpoints[selectedBreakpoint].properties?.padding || ''}
                        onChange={(e) => handleUpdateResponsiveStyle(selectedBreakpoint, 'padding', e.target.value)}
                        placeholder="CSS padding value"
                      />
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h6">Margin</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TextField
                        fullWidth
                        label="Margin (e.g., 10px, 15px 20px)"
                        value={blockConfig.responsiveBreakpoints[selectedBreakpoint].properties?.margin || ''}
                        onChange={(e) => handleUpdateResponsiveStyle(selectedBreakpoint, 'margin', e.target.value)}
                        placeholder="CSS margin value"
                      />
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h6">Display Properties</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Stack spacing={2} sx={{ width: '100%' }}>
                        <TextField
                          fullWidth
                          label="Width (e.g., 100%, 500px)"
                          size="small"
                          onChange={(e) => handleUpdateResponsiveStyle(selectedBreakpoint, 'width', e.target.value)}
                          placeholder="CSS width value"
                        />
                        <TextField
                          fullWidth
                          label="Height (e.g., auto, 200px)"
                          size="small"
                          onChange={(e) => handleUpdateResponsiveStyle(selectedBreakpoint, 'height', e.target.value)}
                          placeholder="CSS height value"
                        />
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                </Stack>
              </TabPanel>

              {/* Advanced Tab */}
              <TabPanel value={tabValue} index={4}>
                <Stack spacing={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={blockConfig.advanced.animationEnabled || false}
                        onChange={(e) => handleUpdateAdvanced('animationEnabled', e.target.checked)}
                      />
                    }
                    label="Enable Animations"
                  />

                  {blockConfig.advanced.animationEnabled && (
                    <>
                      <FormControl fullWidth>
                        <InputLabel>Animation Type</InputLabel>
                        <Select
                          value={blockConfig.advanced.animationType || 'fadeIn'}
                          onChange={(e) => handleUpdateAdvanced('animationType', e.target.value)}
                          label="Animation Type"
                        >
                          <MenuItem value="fadeIn">Fade In</MenuItem>
                          <MenuItem value="slideIn">Slide In</MenuItem>
                          <MenuItem value="bounce">Bounce</MenuItem>
                          <MenuItem value="zoom">Zoom</MenuItem>
                          <MenuItem value="rotate">Rotate</MenuItem>
                        </Select>
                      </FormControl>

                      <Box>
                        <Typography gutterBottom>
                          Duration: {blockConfig.advanced.animationDuration || 300}ms
                        </Typography>
                        <Slider
                          value={blockConfig.advanced.animationDuration || 300}
                          onChange={(e, value) => handleUpdateAdvanced('animationDuration', value)}
                          min={100}
                          max={2000}
                          step={100}
                          marks
                        />
                      </Box>
                    </>
                  )}

                  <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h6">Custom CSS</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TextField
                        fullWidth
                        label="Custom CSS"
                        value={blockConfig.advanced.customCSS || ''}
                        onChange={(e) => handleUpdateAdvanced('customCSS', e.target.value)}
                        multiline
                        rows={6}
                        placeholder="/* Add custom CSS rules here */"
                        sx={{ fontFamily: 'monospace' }}
                      />
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h6">Custom JavaScript</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TextField
                        fullWidth
                        label="Custom JavaScript"
                        value={blockConfig.advanced.customJS || ''}
                        onChange={(e) => handleUpdateAdvanced('customJS', e.target.value)}
                        multiline
                        rows={6}
                        placeholder="// Add custom JavaScript code here"
                        sx={{ fontFamily: 'monospace' }}
                      />
                    </AccordionDetails>
                  </Accordion>
                </Stack>
              </TabPanel>
            </CardContent>
          </Card>
        </Grid>

        {/* Preview Panel */}
        {previewMode && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Live Preview" />
              <Divider />
              <CardContent>
                <Box
                  sx={{
                    ...previewStyles,
                    minHeight: '200px',
                    p: 2,
                    border: '2px dashed #ccc',
                    position: 'relative',
                  }}
                >
                  <Typography variant="h5" sx={{ mb: 2 }}>
                    {blockConfig.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {blockConfig.description}
                  </Typography>

                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                    Properties ({blockConfig.properties.length}):
                  </Typography>
                  <Box sx={{ pl: 2, mb: 2 }}>
                    {blockConfig.properties.map((prop) => (
                      <Box key={prop.id} sx={{ mb: 1 }}>
                        <Typography variant="caption">
                          <strong>{prop.label}:</strong> {prop.value || '(empty)'}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                    Styles ({blockConfig.styles.length}):
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    {blockConfig.styles.map((style) => (
                      <Chip key={style.id} label={style.name} size="small" sx={{ mr: 1, mb: 1 }} />
                    ))}
                  </Box>
                </Box>

                <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="caption" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                    {JSON.stringify(blockConfig, null, 2).substring(0, 500)}...
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Property Dialog */}
      <Dialog open={openPropertyDialog} onClose={() => setOpenPropertyDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingProperty ? 'Edit Property' : 'Add New Property'}</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Property Name"
              value={propertyForm.name || ''}
              onChange={(e) => setPropertyForm({ ...propertyForm, name: e.target.value })}
              placeholder="e.g., title, subtitle"
            />
            <TextField
              fullWidth
              label="Label"
              value={propertyForm.label || ''}
              onChange={(e) => setPropertyForm({ ...propertyForm, label: e.target.value })}
              placeholder="User-friendly label"
            />
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={propertyForm.type || 'text'}
                onChange={(e) => setPropertyForm({ ...propertyForm, type: e.target.value as any })}
                label="Type"
              >
                <MenuItem value="text">Text</MenuItem>
                <MenuItem value="number">Number</MenuItem>
                <MenuItem value="color">Color</MenuItem>
                <MenuItem value="select">Select</MenuItem>
                <MenuItem value="boolean">Boolean</MenuItem>
                <MenuItem value="slider">Slider</MenuItem>
                <MenuItem value="textarea">Textarea</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Default Value"
              value={propertyForm.defaultValue || ''}
              onChange={(e) => setPropertyForm({ ...propertyForm, defaultValue: e.target.value })}
            />
            <TextField
              fullWidth
              label="Placeholder"
              value={propertyForm.placeholder || ''}
              onChange={(e) => setPropertyForm({ ...propertyForm, placeholder: e.target.value })}
            />
            <TextField
              fullWidth
              label="Description"
              value={propertyForm.description || ''}
              onChange={(e) => setPropertyForm({ ...propertyForm, description: e.target.value })}
              multiline
              rows={2}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={propertyForm.required || false}
                  onChange={(e) => setPropertyForm({ ...propertyForm, required: e.target.checked })}
                />
              }
              label="Required"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPropertyDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveProperty} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Style Dialog */}
      <Dialog open={openStyleDialog} onClose={() => setOpenStyleDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingStyle ? 'Edit Style' : 'Add New Style'}</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Style Name"
              value={styleForm.name || ''}
              onChange={(e) => setStyleForm({ ...styleForm, name: e.target.value })}
              placeholder="e.g., Primary, Secondary"
            />
            <TextField
              fullWidth
              label="Background Color"
              type="color"
              value={styleForm.properties?.backgroundColor || '#ffffff'}
              onChange={(e) =>
                setStyleForm({
                  ...styleForm,
                  properties: { ...styleForm.properties, backgroundColor: e.target.value },
                })
              }
            />
            <TextField
              fullWidth
              label="Padding"
              value={styleForm.properties?.padding || ''}
              onChange={(e) =>
                setStyleForm({
                  ...styleForm,
                  properties: { ...styleForm.properties, padding: e.target.value },
                })
              }
              placeholder="e.g., 20px, 15px 20px"
            />
            <TextField
              fullWidth
              label="Border Radius"
              value={styleForm.properties?.borderRadius || ''}
              onChange={(e) =>
                setStyleForm({
                  ...styleForm,
                  properties: { ...styleForm.properties, borderRadius: e.target.value },
                })
              }
              placeholder="e.g., 8px, 50%"
            />
            <TextField
              fullWidth
              label="Box Shadow"
              value={styleForm.properties?.boxShadow || ''}
              onChange={(e) =>
                setStyleForm({
                  ...styleForm,
                  properties: { ...styleForm.properties, boxShadow: e.target.value },
                })
              }
              placeholder="e.g., 0 2px 8px rgba(0,0,0,0.1)"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStyleDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveStyle} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Configurator;
