import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { WebView } from 'react-native-webview';
import { homeService } from '../../services/api/endpoints';
import { SERVER_BASE_URL } from '../../utils/constants';
import { useTheme } from '../../hooks/useTheme';
import { spacing, typography, borderRadius } from '../../theme';
import { RootStackParamList } from '../../types';

type EbookDetailRouteProp = RouteProp<RootStackParamList, 'EbookDetail'>;

interface Ebook {
  id: string;
  title: string;
  description: string;
  isbn?: string;
  publisher?: string;
  published_date?: string;
  pages?: number;
  poster?: string;
  banner?: string;
  pdf_file: string;
  category?: {
    id: string;
    name: string;
    description: string;
    color: string;
  };
  authors?: Array<{
    id: string;
    name: string;
    bio?: string;
    photo?: string;
  }>;
  views_count?: number;
  rating_average?: number;
  rating_count?: number;
}

const getImageUrl = (imagePath: string | undefined): string | undefined => {
  if (!imagePath) return undefined;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  return `${SERVER_BASE_URL}/${cleanPath}`;
};

const getPdfUrl = (pdfPath: string): string => {
  if (pdfPath.startsWith('http://') || pdfPath.startsWith('https://')) {
    return pdfPath;
  }
  const cleanPath = pdfPath.startsWith('/') ? pdfPath.slice(1) : pdfPath;
  return `${SERVER_BASE_URL}/${cleanPath}`;
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
};

export const EbookDetailScreen: React.FC = () => {
  const route = useRoute<EbookDetailRouteProp>();
  const navigation = useNavigation();
  const { id } = route.params;
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [ebook, setEbook] = useState<Ebook | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(true);

  useEffect(() => {
    loadEbook();
  }, [id]);

  const loadEbook = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await homeService.getEbookById(id);
      setEbook(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar ebook');
      console.error('Erro ao carregar ebook:', err);
    } finally {
      setLoading(false);
    }
  };

  const pdfUrl = ebook ? getPdfUrl(ebook.pdf_file) : '';

  // HTML com PDF.js para visualizar PDF diretamente (sem dependência de serviços externos)
  const getPdfViewerHtml = (url: string): string => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
          <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              margin: 0;
              padding: 10px;
              background-color: #1a1a1a;
              overflow-x: auto;
              overflow-y: scroll;
            }
            #pdf-container {
              display: flex;
              flex-direction: column;
              align-items: center;
              width: 100%;
            }
            canvas {
              max-width: 100%;
              height: auto;
              margin-bottom: 10px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            }
            .loading {
              color: #fff;
              font-family: Arial, sans-serif;
              padding: 20px;
              text-align: center;
            }
            .error {
              color: #ff4444;
              font-family: Arial, sans-serif;
              padding: 20px;
              text-align: center;
            }
            .page-info {
              color: #ccc;
              font-family: Arial, sans-serif;
              padding: 10px;
              text-align: center;
              margin-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <div id="pdf-container">
            <div class="loading">Carregando PDF...</div>
          </div>
          <script>
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            
            let pdfDoc = null;
            let pageNum = 1;
            let pageRendering = false;
            let pageNumPending = null;
            const scale = 1.5;
            const container = document.getElementById('pdf-container');
            
            function renderPage(num) {
              pageRendering = true;
              pdfDoc.getPage(num).then(function(page) {
                const viewport = page.getViewport({scale: scale});
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                
                container.innerHTML = '';
                container.appendChild(canvas);
                
                const renderContext = {
                  canvasContext: ctx,
                  viewport: viewport
                };
                
                const renderTask = page.render(renderContext);
                
                renderTask.promise.then(function() {
                  pageRendering = false;
                  if (pageNumPending !== null) {
                    renderPage(pageNumPending);
                    pageNumPending = null;
                  }
                  
                  const pageInfo = document.createElement('div');
                  pageInfo.className = 'page-info';
                  pageInfo.textContent = 'Página ' + num + ' de ' + pdfDoc.numPages;
                  container.appendChild(pageInfo);
                });
              });
            }
            
            function queueRenderPage(num) {
              if (pageRendering) {
                pageNumPending = num;
              } else {
                renderPage(num);
              }
            }
            
            function onPrevPage() {
              if (pageNum <= 1) return;
              pageNum--;
              queueRenderPage(pageNum);
            }
            
            function onNextPage() {
              if (pageNum >= pdfDoc.numPages) return;
              pageNum++;
              queueRenderPage(pageNum);
            }
            
            // Carregar PDF
            pdfjsLib.getDocument('${url}').promise.then(function(pdf) {
              pdfDoc = pdf;
              renderPage(pageNum);
              
              // Adicionar controles de navegação
              const controls = document.createElement('div');
              controls.style.cssText = 'position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.8); padding: 10px; border-radius: 25px; display: flex; gap: 10px; z-index: 1000;';
              
              const prevBtn = document.createElement('button');
              prevBtn.textContent = '◀';
              prevBtn.style.cssText = 'background: #4CAF50; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;';
              prevBtn.onclick = onPrevPage;
              
              const nextBtn = document.createElement('button');
              nextBtn.textContent = '▶';
              nextBtn.style.cssText = 'background: #4CAF50; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;';
              nextBtn.onclick = onNextPage;
              
              controls.appendChild(prevBtn);
              controls.appendChild(nextBtn);
              document.body.appendChild(controls);
            }).catch(function(error) {
              container.innerHTML = '<div class="error">Erro ao carregar PDF: ' + error.message + '</div>';
              console.error('Erro ao carregar PDF:', error);
            });
            
            // Previne download
            document.addEventListener('contextmenu', function(e) {
              e.preventDefault();
            });
          </script>
        </body>
      </html>
    `;
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },
        scrollView: {
          flex: 1,
        },
        content: {
          paddingBottom: spacing.xxl,
        },
        bannerContainer: {
          width: '100%',
          height: 300,
          position: 'relative',
        },
        banner: {
          width: '100%',
          height: '100%',
          resizeMode: 'cover',
        },
        bannerOverlay: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 150,
          backgroundColor: 'rgba(0,0,0,0.5)',
        },
        backButton: {
          position: 'absolute',
          top: spacing.lg,
          left: spacing.lg,
          zIndex: 10,
          backgroundColor: 'rgba(0,0,0,0.5)',
          borderRadius: borderRadius.round,
          padding: spacing.sm,
        },
        infoContainer: {
          padding: spacing.lg,
        },
        title: {
          ...typography.h1,
          color: colors.foreground,
          fontWeight: '700',
          marginBottom: spacing.sm,
        },
        metaRow: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: spacing.md,
          flexWrap: 'wrap',
        },
        metaItem: {
          flexDirection: 'row',
          alignItems: 'center',
          marginRight: spacing.md,
          marginBottom: spacing.xs,
        },
        metaText: {
          ...typography.body,
          color: colors.mutedForeground,
          marginLeft: spacing.xs,
        },
        description: {
          ...typography.body,
          color: colors.foreground,
          lineHeight: 24,
          marginBottom: spacing.lg,
        },
        categoryContainer: {
          marginBottom: spacing.lg,
        },
        categoryTag: {
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.xs,
          borderRadius: borderRadius.md,
          alignSelf: 'flex-start',
        },
        categoryText: {
          ...typography.caption,
          color: colors.foreground,
          fontWeight: '600',
        },
        authorsContainer: {
          marginBottom: spacing.lg,
        },
        authorsTitle: {
          ...typography.body,
          color: colors.foreground,
          fontWeight: '600',
          marginBottom: spacing.sm,
        },
        authorItem: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: spacing.sm,
        },
        authorPhoto: {
          width: 40,
          height: 40,
          borderRadius: borderRadius.round,
          marginRight: spacing.sm,
        },
        authorName: {
          ...typography.body,
          color: colors.foreground,
          fontWeight: '500',
        },
        pdfContainer: {
          flex: 1,
          height: 600,
          marginTop: spacing.lg,
          borderRadius: borderRadius.md,
          overflow: 'hidden',
          backgroundColor: colors.card,
        },
        pdfWebView: {
          flex: 1,
          backgroundColor: colors.background,
        },
        pdfLoadingContainer: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.card,
        },
        loadingContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        },
        errorContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: spacing.lg,
        },
        errorText: {
          ...typography.body,
          color: colors.mutedForeground,
          textAlign: 'center',
        },
      }),
    [colors]
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !ebook) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.errorContainer}>
          <Icon name="error-outline" size={48} color={colors.mutedForeground} />
          <Text style={styles.errorText}>
            {error || 'Ebook não encontrado'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.bannerContainer}>
          {ebook.banner && (
            <Image
              source={{ uri: getImageUrl(ebook.banner) }}
              style={styles.banner}
            />
          )}
          <View style={styles.bannerOverlay} />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={colors.foreground} />
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{ebook.title}</Text>

          {/* Meta Info */}
          <View style={styles.metaRow}>
            {ebook.pages && (
              <View style={styles.metaItem}>
                <Icon name="book" size={16} color={colors.mutedForeground} />
                <Text style={styles.metaText}>{ebook.pages} páginas</Text>
              </View>
            )}
            {ebook.views_count !== undefined && (
              <View style={styles.metaItem}>
                <Icon name="visibility" size={16} color={colors.mutedForeground} />
                <Text style={styles.metaText}>{ebook.views_count} visualizações</Text>
              </View>
            )}
            {ebook.published_date && (
              <View style={styles.metaItem}>
                <Icon name="calendar-today" size={16} color={colors.mutedForeground} />
                <Text style={styles.metaText}>{formatDate(ebook.published_date)}</Text>
              </View>
            )}
            {ebook.isbn && (
              <View style={styles.metaItem}>
                <Icon name="qr-code" size={16} color={colors.mutedForeground} />
                <Text style={styles.metaText}>{ebook.isbn}</Text>
              </View>
            )}
          </View>

          {/* Publisher */}
          {ebook.publisher && (
            <View style={styles.metaItem}>
              <Icon name="business" size={16} color={colors.mutedForeground} />
              <Text style={styles.metaText}>{ebook.publisher}</Text>
            </View>
          )}

          {/* Description */}
          {ebook.description && (
            <Text style={styles.description}>{ebook.description}</Text>
          )}

          {/* Category */}
          {ebook.category && (
            <View style={styles.categoryContainer}>
              <View
                style={[
                  styles.categoryTag,
                  { backgroundColor: ebook.category.color || colors.card },
                ]}>
                <Text style={styles.categoryText}>{ebook.category.name}</Text>
              </View>
            </View>
          )}

          {/* Authors */}
          {ebook.authors && ebook.authors.length > 0 && (
            <View style={styles.authorsContainer}>
              <Text style={styles.authorsTitle}>Autor(es)</Text>
              {ebook.authors.map((author) => (
                <View key={author.id} style={styles.authorItem}>
                  {author.photo && (
                    <Image
                      source={{ uri: getImageUrl(author.photo) }}
                      style={styles.authorPhoto}
                    />
                  )}
                  <Text style={styles.authorName}>{author.name}</Text>
                </View>
              ))}
            </View>
          )}

          {/* PDF Viewer */}
          {ebook.pdf_file && pdfUrl && (
            <View style={styles.pdfContainer}>
              {pdfLoading && (
                <View style={styles.pdfLoadingContainer}>
                  <ActivityIndicator size="large" color={colors.primary} />
                  <Text style={[styles.metaText, { marginTop: spacing.md }]}>
                    Carregando PDF...
                  </Text>
                </View>
              )}
              <WebView
                style={styles.pdfWebView}
                source={{ 
                  html: getPdfViewerHtml(pdfUrl)
                }}
                onLoadEnd={() => {
                  setPdfLoading(false);
                  console.log('PDF viewer carregado com sucesso');
                }}
                onError={(syntheticEvent) => {
                  const { nativeEvent } = syntheticEvent;
                  console.error('Erro ao carregar PDF viewer:', nativeEvent);
                  setPdfLoading(false);
                }}
                onHttpError={(syntheticEvent) => {
                  const { nativeEvent } = syntheticEvent;
                  console.error('HTTP error ao carregar PDF:', nativeEvent.statusCode);
                  setPdfLoading(false);
                }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                scalesPageToFit={true}
                showsVerticalScrollIndicator={true}
                showsHorizontalScrollIndicator={false}
                allowFileAccess={true}
                allowUniversalAccessFromFileURLs={true}
                mixedContentMode="always"
                androidLayerType="hardware"
                cacheEnabled={true}
                cacheMode="LOAD_CACHE_ELSE_NETWORK"
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

