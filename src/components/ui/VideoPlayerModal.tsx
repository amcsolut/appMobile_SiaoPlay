import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import YoutubePlayer from 'react-native-youtube-iframe';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../hooks/useTheme';
import { spacing, borderRadius } from '../../theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface VideoPlayerModalProps {
  visible: boolean;
  videoUrl: string;
  onClose: () => void;
}

// Função para extrair ID do vídeo do YouTube
const extractYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;
  
  // Padrão 1: https://www.youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
  if (watchMatch && watchMatch[1]) {
    const videoId = watchMatch[1].split('&')[0].split('?')[0];
    if (videoId.length === 11) {
      return videoId;
    }
  }
  
  // Padrão 2: https://youtu.be/VIDEO_ID
  const shortMatch = url.match(/youtu\.be\/([^&\n?#]+)/);
  if (shortMatch && shortMatch[1]) {
    const videoId = shortMatch[1].split('&')[0].split('?')[0];
    if (videoId.length === 11) {
      return videoId;
    }
  }
  
  return null;
};

// Função para verificar se é YouTube
const isYouTubeUrl = (url: string): boolean => {
  return url.includes('youtube.com') || url.includes('youtu.be');
};

// Função para converter URL do Vimeo para formato embed
const getVimeoEmbedUrl = (url: string): string | null => {
  const regExp = /(?:vimeo\.com\/)(?:.*\/)?(\d+)/;
  const match = url.match(regExp);
  if (match && match[1]) {
    return `https://player.vimeo.com/video/${match[1]}?autoplay=1`;
  }
  return null;
};

// Função para verificar se é Panda Videos
const getPandaVideosEmbedUrl = (url: string): string | null => {
  if (url.includes('pandavideo.com') || url.includes('panda.video')) {
    // Para Panda Videos, geralmente já vem no formato correto ou precisa ser ajustado
    // Se a URL já contém /embed, usar diretamente
    if (url.includes('/embed')) {
      return url.includes('?') ? `${url}&autoplay=1` : `${url}?autoplay=1`;
    }
    // Caso contrário, tentar extrair o ID ou usar a URL diretamente
    return url.includes('?') ? `${url}&autoplay=1` : `${url}?autoplay=1`;
  }
  return null;
};

const getEmbedUrl = (url: string): string | null => {
  // Tentar Vimeo
  const vimeoEmbed = getVimeoEmbedUrl(url);
  if (vimeoEmbed) return vimeoEmbed;

  // Tentar Panda Videos
  const pandaEmbed = getPandaVideosEmbedUrl(url);
  if (pandaEmbed) return pandaEmbed;

  // Se não for nenhum dos suportados, retornar null
  return null;
};

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  visible,
  videoUrl,
  onClose,
}) => {
  const { colors } = useTheme();
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(true);

  const isYouTube = useMemo(() => {
    return videoUrl ? isYouTubeUrl(videoUrl) : false;
  }, [videoUrl]);

  const youtubeVideoId = useMemo(() => {
    if (!isYouTube || !videoUrl) return null;
    return extractYouTubeVideoId(videoUrl);
  }, [isYouTube, videoUrl]);

  const embedUrl = useMemo(() => {
    if (!videoUrl || isYouTube) return null;
    return getEmbedUrl(videoUrl);
  }, [videoUrl, isYouTube]);

  const htmlContent = useMemo(() => {
    if (!embedUrl) return null;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            html, body {
              width: 100%;
              height: 100%;
              overflow: hidden;
              background: #000;
            }
            iframe {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              border: none;
            }
          </style>
        </head>
        <body>
          <iframe
            id="video-player"
            src="${embedUrl}"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
            playsinline
            style="width: 100%; height: 100%;"
          ></iframe>
          <script>
            window.addEventListener('load', function() {
              var iframe = document.getElementById('video-player');
              if (iframe) {
                iframe.style.width = '100%';
                iframe.style.height = '100%';
              }
            });
          </script>
        </body>
      </html>
    `;
  }, [embedUrl]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        modal: {
          flex: 1,
          backgroundColor: '#000000',
        },
        container: {
          flex: 1,
          backgroundColor: '#000000',
          justifyContent: 'center',
          alignItems: 'center',
        },
        youtubeContainer: {
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT,
          backgroundColor: '#000000',
        },
        closeButton: {
          position: 'absolute',
          top: spacing.xl,
          right: spacing.lg,
          zIndex: 1000,
          backgroundColor: 'rgba(0,0,0,0.7)',
          borderRadius: borderRadius.round,
          padding: spacing.sm,
        },
        webView: {
          flex: 1,
          backgroundColor: '#000000',
        },
        loadingContainer: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#000000',
        },
        errorContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: spacing.lg,
        },
        errorText: {
          color: '#FFFFFF',
          fontSize: 16,
          textAlign: 'center',
        },
      }),
    [colors]
  );

  if (!visible || !videoUrl) {
    return null;
  }

  // Verificar se tem fonte válida
  const hasValidSource = (isYouTube && youtubeVideoId) || (!isYouTube && embedUrl && htmlContent);

  if (!hasValidSource) {
    return (
      <Modal
        visible={visible}
        animationType="fade"
        transparent={false}
        onRequestClose={onClose}>
        <View style={styles.modal}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.errorContainer}>
            <Icon name="error-outline" size={48} color="#FFFFFF" />
            <Text style={styles.errorText}>
              Formato de vídeo não suportado ou URL inválida
            </Text>
            <Text style={[styles.errorText, { marginTop: spacing.md, fontSize: 12 }]}>
              URL: {videoUrl}
            </Text>
          </View>
        </View>
      </Modal>
    );
  }

  if (hasError) {
    return (
      <Modal
        visible={visible}
        animationType="fade"
        transparent={false}
        onRequestClose={onClose}>
        <View style={styles.modal}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.errorContainer}>
            <Icon name="error-outline" size={48} color="#FFFFFF" />
            <Text style={styles.errorText}>
              Erro ao carregar o vídeo
            </Text>
            <Text style={[styles.errorText, { marginTop: spacing.md, fontSize: 12 }]}>
              Tente novamente ou verifique sua conexão
            </Text>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      onRequestClose={onClose}
      supportedOrientations={['portrait', 'landscape']}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Icon name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {isYouTube && youtubeVideoId ? (
          <View style={styles.youtubeContainer}>
            <YoutubePlayer
              height={SCREEN_HEIGHT}
              width={SCREEN_WIDTH}
              videoId={youtubeVideoId}
              play={playing}
              onChangeState={(state) => {
                if (state === 'ended') {
                  setPlaying(false);
                }
              }}
              onError={(error) => {
                console.warn('YouTube Player error:', error);
                setHasError(true);
              }}
              onReady={() => {
                setLoading(false);
                setHasError(false);
              }}
              initialPlayerParams={{
                controls: true,
                modestbranding: true,
                rel: false,
                iv_load_policy: 3,
                cc_load_policy: 0,
              }}
            />
            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FFFFFF" />
              </View>
            )}
          </View>
        ) : (
          <WebView
            source={{ html: htmlContent || '' }}
            style={styles.webView}
            allowsFullscreenVideo={true}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            mixedContentMode="always"
            originWhitelist={['*']}
            setSupportMultipleWindows={false}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.warn('WebView error: ', nativeEvent);
              setHasError(true);
            }}
            onHttpError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.warn('WebView HTTP error: ', nativeEvent);
              setHasError(true);
            }}
            onLoadEnd={() => {
              setLoading(false);
              setHasError(false);
            }}
            renderLoading={() => (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FFFFFF" />
              </View>
            )}
          />
        )}
        {loading && !isYouTube && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
          </View>
        )}
      </View>
    </Modal>
  );
};

