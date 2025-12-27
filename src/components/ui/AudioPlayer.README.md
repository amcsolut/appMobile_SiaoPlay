# AudioPlayer Component

Componente reutilizável de player de áudio para audiobooks e álbuns de música.

## Instalação

A biblioteca `react-native-track-player` já está instalada. Após fazer as alterações, execute:

```bash
# Android
cd android && ./gradlew clean && cd ..
npx react-native run-android

# iOS
cd ios && pod install && cd ..
npx react-native run-ios
```

## Uso Básico

```typescript
import { AudioPlayer } from '../../components/ui/AudioPlayer';
import { AudioTrack } from '../../hooks/useAudioPlayer';

const tracks: AudioTrack[] = [
  {
    id: '1',
    url: 'https://example.com/audio1.mp3',
    title: 'Capítulo 1',
    artist: 'Autor',
    artwork: 'https://example.com/cover.jpg',
    duration: 3600, // em segundos
  },
  // ... mais tracks
];

<AudioPlayer
  tracks={tracks}
  autoPlay={false}
  showArtwork={true}
  showTrackList={true}
/>
```

## Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `tracks` | `AudioTrack[]` | **obrigatório** | Array de faixas de áudio |
| `autoPlay` | `boolean` | `false` | Reproduzir automaticamente ao carregar |
| `showArtwork` | `boolean` | `true` | Mostrar capa/artwork |
| `showTrackList` | `boolean` | `false` | Mostrar lista de faixas |
| `onTrackEnd` | `() => void` | - | Callback quando todas as faixas terminarem |
| `onPlaybackStateChanged` | `(state: State) => void` | - | Callback quando o estado mudar |

## Interface AudioTrack

```typescript
interface AudioTrack {
  id: string;           // ID único da faixa
  url: string;          // URL do arquivo de áudio (relativa ou absoluta)
  title: string;        // Título da faixa
  artist?: string;      // Artista/autor (opcional)
  artwork?: string;     // URL da capa (opcional)
  duration?: number;    // Duração em segundos (opcional)
}
```

## Exemplo: Audiobook

```typescript
import { useEffect, useState } from 'react';
import { AudioPlayer } from '../../components/ui/AudioPlayer';
import { AudioTrack } from '../../hooks/useAudioPlayer';
import { homeService } from '../../services/api/endpoints';

const AudiobookPlayer = ({ audiobookId }: { audiobookId: string }) => {
  const [tracks, setTracks] = useState<AudioTrack[]>([]);

  useEffect(() => {
    loadChapters();
  }, [audiobookId]);

  const loadChapters = async () => {
    const chapters = await homeService.getAudiobookChapters(audiobookId);
    const audiobook = await homeService.getAudiobookById(audiobookId);

    const audioTracks: AudioTrack[] = chapters
      .filter(ch => ch.is_published && ch.audio_file)
      .sort((a, b) => a.order - b.order)
      .map(chapter => ({
        id: chapter.id,
        url: chapter.audio_file,
        title: chapter.title,
        artist: audiobook.authors?.[0]?.name || 'Desconhecido',
        artwork: audiobook.poster,
        duration: chapter.duration || 0,
      }));

    setTracks(audioTracks);
  };

  return (
    <AudioPlayer
      tracks={tracks}
      showTrackList={true}
      onTrackEnd={() => console.log('Audiobook finalizado')}
    />
  );
};
```

## Exemplo: Álbum de Música

```typescript
const AlbumPlayer = ({ albumId }: { albumId: string }) => {
  const [tracks, setTracks] = useState<AudioTrack[]>([]);

  useEffect(() => {
    loadTracks();
  }, [albumId]);

  const loadTracks = async () => {
    const albumTracks = await homeService.getAlbumTracks(albumId);
    const album = await homeService.getAlbumById(albumId);

    const audioTracks: AudioTrack[] = albumTracks
      .filter(t => t.is_published && t.audio_file)
      .sort((a, b) => a.track_number - b.track_number)
      .map(track => ({
        id: track.id,
        url: track.audio_file,
        title: track.title,
        artist: album.artist?.name || 'Desconhecido',
        artwork: album.poster,
        duration: track.duration || 0,
      }));

    setTracks(audioTracks);
  };

  return <AudioPlayer tracks={tracks} showTrackList={true} />;
};
```

## Funcionalidades

- ✅ Reprodução de múltiplas faixas em sequência
- ✅ Controles de play/pause, próximo/anterior
- ✅ Barra de progresso interativa
- ✅ Exibição de tempo atual e total
- ✅ Lista de faixas clicável
- ✅ Suporte a artwork/capa
- ✅ Reprodução em background (Android e iOS)
- ✅ Controles de mídia do sistema (notificação, lock screen)

## Notas

- As URLs de áudio podem ser relativas (serão convertidas automaticamente usando `SERVER_BASE_URL`)
- O player suporta reprodução em background
- Os controles de mídia do sistema funcionam automaticamente
- O player gerencia automaticamente a transição entre faixas

