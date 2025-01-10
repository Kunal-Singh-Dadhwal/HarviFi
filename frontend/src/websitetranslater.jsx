import React, { useState, useEffect } from 'react';
import './websitetranslator.css'
const API_KEY = 'AIzaSyBfG3BIdngIXvdLNbbg4B5QHb4mdBdrzX4';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

const LANGUAGES = {
  hi: "Hindi",
  es: "Spanish",
  fr: "French",
  de: "German",
  ja: "Japanese",
  ko: "Korean",
  zh: "Chinese",
  ru: "Russian",
  ar: "Arabic",
  it: "Italian"
};

const BATCH_SIZE = 5;

const WebsiteTranslator = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('hi');
  const [progress, setProgress] = useState(0);
  const translationCache = new Map();
  const [observer, setObserver] = useState(null);

  useEffect(() => {
    // Create mutation observer
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          handleNewContent(mutation.addedNodes);
        }
      });
    });

    setObserver(mutationObserver);

    return () => {
      if (mutationObserver) {
        mutationObserver.disconnect();
      }
    };
  }, []);

  const handleNewContent = async (nodes) => {
    if (loading) return; // Don't process if already translating
    
    const textNodes = [];
    nodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const walker = document.createTreeWalker(
          node,
          NodeFilter.SHOW_TEXT,
          { acceptNode: shouldTranslateNode }
        );
        let textNode;
        while (textNode = walker.nextNode()) {
          textNodes.push(textNode);
        }
      }
    });

    if (textNodes.length > 0) {
      await translateNodes(textNodes);
    }
  };

  const translateText = async (text) => {
    const cacheKey = `${selectedLanguage}:${text}`;
    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey);
    }

    try {
      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Translate the following text to ${LANGUAGES[selectedLanguage]}: ${text}`
            }]
          }],
          generationConfig: {
            temperature: 0.1,
            topK: 1,
            topP: 1
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid API response structure');
      }

      const translatedText = data.candidates[0].content.parts[0].text
        .replace(/^Translation:\s*/i, '')
        .trim();

      translationCache.set(cacheKey, translatedText);
      return translatedText;
    } catch (err) {
      console.error('Translation error:', err);
      throw new Error(`Translation failed: ${err.message}`);
    }
  };

  const shouldTranslateNode = (node) => {
    if (!node || !node.parentElement) return NodeFilter.FILTER_REJECT;

    const skipTags = ['SCRIPT', 'STYLE', 'CODE', 'PRE', 'META', 'LINK', 'INPUT', 'TEXTAREA'];
    if (skipTags.includes(node.parentElement.tagName)) {
      return NodeFilter.FILTER_REJECT;
    }

    const skipClasses = ['notranslate', 'code'];
    if (node.parentElement.classList && 
        skipClasses.some(cls => node.parentElement.classList.contains(cls))) {
      return NodeFilter.FILTER_REJECT;
    }

    const isTranslatorUI = node.parentElement.closest('.translator-ui');
    if (isTranslatorUI) return NodeFilter.FILTER_REJECT;

    const text = node.textContent.trim();
    if (!text || text.length <= 1 || /^\d+$/.test(text) || /^[{}<>()[\].,;:]+$/.test(text)) {
      return NodeFilter.FILTER_REJECT;
    }

    return NodeFilter.FILTER_ACCEPT;
  };

  const getAllTranslatableNodes = () => {
    const nodes = [];
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      { acceptNode: shouldTranslateNode }
    );

    let node;
    while (node = walker.nextNode()) {
      nodes.push(node);
    }
    return nodes;
  };

  const translateNodes = async (nodes) => {
    for (let i = 0; i < nodes.length; i += BATCH_SIZE) {
      const batch = nodes.slice(i, i + BATCH_SIZE);
      await Promise.all(batch.map(async (node) => {
        try {
          const originalText = node.textContent.trim();
          const translatedText = await translateText(originalText);
          node.textContent = translatedText;
        } catch (err) {
          console.error(`Failed to translate: ${node.textContent}`, err);
        }
      }));
    }
  };

  const translateWebsiteContent = async () => {
    setLoading(true);
    setError(null);
    setProgress(0);
    translationCache.clear(); // Clear cache for retranslation
    setStatus('Collecting content to translate...');

    try {
      // Start observing for dynamic content
      if (observer) {
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
      }

      const allNodes = getAllTranslatableNodes();
      const totalNodes = allNodes.length;

      if (totalNodes === 0) {
        setStatus('No content found to translate.');
        return;
      }

      setStatus(`Found ${totalNodes} items to translate. Starting translation...`);
      let translatedCount = 0;

      for (let i = 0; i < totalNodes; i += BATCH_SIZE) {
        const batchNodes = allNodes.slice(i, Math.min(i + BATCH_SIZE, totalNodes));
        await translateNodes(batchNodes);
        
        translatedCount += batchNodes.length;
        const currentProgress = Math.min(100, Math.round((translatedCount / totalNodes) * 100));
        setProgress(currentProgress);
        setStatus(`Translating... ${currentProgress}% complete`);
      }

      setStatus(`Translation completed! Successfully translated ${translatedCount} items to ${LANGUAGES[selectedLanguage]}.`);
    } catch (err) {
      setError(err.message);
      setStatus('');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="transc">
      <div className="flex flex-col gap-3">
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="ajaj"
          disabled={loading}
        >
          {Object.entries(LANGUAGES).map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>

        <button
          onClick={translateWebsiteContent}
          disabled={loading}
          className="transb"
        >
          {loading ? 'Translating...' : `Translate to ${LANGUAGES[selectedLanguage]}`}
        </button>

        {loading && progress > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {status && (
          <div className="text-sm text-gray-600">
            {status}
          </div>
        )}

        {error && (
          <div className="text-sm text-red-500">
            Error: {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default WebsiteTranslator;