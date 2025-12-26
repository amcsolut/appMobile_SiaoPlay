import React, { useMemo } from 'react';
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
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../hooks/useTheme';
import { spacing, borderRadius } from '../../theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface VideoPlayerModalProps {
  visible: boolean;
  videoUrl: string;
  onClose: () => void;
}

// Função para converter URL do YouTube para formato embed
const getYouTubeEmbedUrl = (url: string): string | null => {
  let videoId = null;
  
  // Padrão 1: https://www.youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
  if (watchMatch && watchMatch[1]) {
    videoId = watchMatch[1];
  }
  
  // Padrão 2: https://youtu.be/VIDEO_ID
  if (!videoId) {
    const shortMatch = url.match(/youtu\.be\/([^&\n?#]+)/);
    if (shortMatch && shortMatch[1]) {
      videoId = shortMatch[1];
    }
  }
  
  if (videoId && videoId.length === 11) {
    // Remover parâmetros extras se houver
    videoId = videoId.split('&')[0].split('?')[0];
    // Usar parâmetros que funcionam melhor em WebView mobile
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&controls=1&fs=1&iv_load_policy=3&cc_load_policy=0`;
  }
  
  return null;
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
  // Tentar YouTube primeiro
  const youtubeEmbed = getYouTubeEmbedUrl(url);
  if (youtubeEmbed) return youtubeEmbed;

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
  const [hasError, setHasError] = React.useState(false);

  const embedUrl = useMemo(() => {
    if (!videoUrl) return null;
    const url = getEmbedUrl(videoUrl);
    console.log('[VideoPlayerModal] Original URL:', videoUrl);
    console.log('[VideoPlayerModal] Embed URL:', url);
    return url;
  }, [videoUrl]);

  // Verificar se é YouTube
  const isYouTube = videoUrl && (
    videoUrl.includes('youtube.com') || 
    videoUrl.includes('youtu.be')
  );

  // Extrair ID do vídeo do YouTube
  const youtubeVideoId = useMemo(() => {
    if (!isYouTube) return null;
    const watchMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    if (watchMatch && watchMatch[1]) {
      return watchMatch[1].split('&')[0].split('?')[0];
    }
    return null;
  }, [videoUrl, isYouTube]);

  // URL do embed do YouTube para usar diretamente no WebView
  const youtubeEmbedUrl = useMemo(() => {
    if (isYouTube && youtubeVideoId) {
      // Usar parâmetros que funcionam melhor em WebView mobile
      // Remover origin para evitar problemas de CORS
      return `https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&controls=1&fs=1&iv_load_policy=3&cc_load_policy=0&widget_referrer=app`;
    }
    return null;
  }, [isYouTube, youtubeVideoId]);

  const htmlContent = useMemo(() => {
    // Para YouTube, usar iframe embed com configurações especiais
    if (isYouTube && youtubeEmbedUrl) {
      // Tentar usar o player do YouTube sem origin para evitar erro 153
      const embedUrlNoOrigin = `https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=0&controls=1&fs=1&iv_load_policy=3&cc_load_policy=0`;
      
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
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
                position: relative;
              }
              iframe {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border: none;
                display: block;
              }
            </style>
          </head>
          <body>
            <iframe
              id="video-player"
              src="${embedUrlNoOrigin}"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
              webkitallowfullscreen
              mozallowfullscreen
              style="width: 100%; height: 100%;"
            ></iframe>
          </body>
        </html>
      `;
    }
    
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
  const hasValidSource = (isYouTube && youtubeEmbedUrl && htmlContent) || (!isYouTube && embedUrl && htmlContent);

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
        <WebView
          source={
            isYouTube && youtubeEmbedUrl
              ? { uri: youtubeEmbedUrl }
              : { html: htmlContent || '' }
          }
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
          userAgent="Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
          onShouldStartLoadWithRequest={(request) => {
            // Permitir about:blank e recursos necessários
            const url = request.url;
            
            if (url === 'about:blank' || !url || url.startsWith('data:') || url.startsWith('blob:')) {
              return true;
            }
            
            // Para YouTube, permitir apenas URLs do embed e recursos necessários
            if (isYouTube) {
              // Permitir todos os recursos do YouTube necessários para o player
              if (
                url.includes('youtube.com/embed/') ||
                url.includes('youtube.com/api/') ||
                url.includes('youtube.com/s/') ||
                url.includes('youtube.com/yts/') ||
                url.includes('google.com') ||
                url.includes('gstatic.com') ||
                url.includes('doubleclick.net') ||
                url.includes('googlevideo.com') ||
                url.includes('ytimg.com') ||
                url.includes('googleapis.com')
              ) {
                return true;
              }
              // Bloquear redirecionamentos para watch, app ou outros
              if (url.includes('youtube.com/watch') || 
                  url.includes('youtube.com/app') ||
                  url.includes('youtube.com/redirect') ||
                  url.includes('youtube.com/channel') ||
                  url.includes('youtube.com/user')) {
                console.log('[VideoPlayerModal] Bloqueando redirecionamento:', url);
                return false;
              }
              // Bloquear outros domínios
              console.log('[VideoPlayerModal] Bloqueando domínio não permitido:', url);
              return false;
            }
            
            // Para outros serviços, permitir normalmente
            return true;
          }}
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
            setHasError(false);
          }}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FFFFFF" />
            </View>
          )}
        />
      </View>
    </Modal>
  );
};

