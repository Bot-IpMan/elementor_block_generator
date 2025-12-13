"""Embedding function factory with FastEmbed fallback handling.

This module tries to use FastEmbed when available and the requested model is
supported. If FastEmbed is unavailable or rejects the model, we gracefully
fallback to the SentenceTransformer-based embedding from LlamaIndex.
"""
from __future__ import annotations

import logging
from typing import Any

logger = logging.getLogger(__name__)


def _is_fastembed_model_supported(model_name: str) -> bool:
    """Return True if FastEmbed has the requested model available.

    FastEmbed raises a ValueError when trying to instantiate an unsupported
    model. We proactively check the supported list to avoid surfacing that
    exception during startup.
    """
    try:
        from fastembed import TextEmbedding

        supported_models = set(TextEmbedding.list_supported_models())
    except Exception as exc:  # pragma: no cover - defensive import guard
        logger.warning("FastEmbed unavailable, skipping support check: %s", exc)
        return False

    return model_name in supported_models


def create_embedding_function(model_name: str) -> Any:
    """Create an embedding function with FastEmbed when possible.

    If the requested model is not supported by FastEmbed or FastEmbed cannot be
    imported, we fall back to the SentenceTransformer-based implementation from
    LlamaIndex. This prevents crashes like ``ValueError: Model <name> is not
    supported in TextEmbedding`` during service startup.
    """
    try:
        if _is_fastembed_model_supported(model_name):
            from fastembed import TextEmbedding
            from llama_index.embeddings.fastembed import FastEmbedEmbeddingFunction

            logger.info("Using FastEmbed backend for model '%s'", model_name)
            return FastEmbedEmbeddingFunction(TextEmbedding(model_name=model_name))

        logger.warning(
            "Model '%s' not supported by FastEmbed; using SentenceTransformer backend",
            model_name,
        )
    except Exception as exc:  # pragma: no cover - defensive import guard
        logger.warning("FastEmbed initialization failed: %s", exc)

    from llama_index.embeddings.huggingface import SentenceTransformerEmbedding

    logger.info("Falling back to SentenceTransformer for model '%s'", model_name)
    return SentenceTransformerEmbedding(model_name=model_name)
