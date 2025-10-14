import { useMovieDetails } from "@/shared/services/queries";
import { Stack, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/w780";

export default function MovieDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const movieId = parseInt(id, 10);

  const { data: movie, isLoading, isError, error } = useMovieDetails(movieId);

  const screenTitle = movie?.title || "Movie Details";

  if (isLoading) {
    return (
      <>
        <Stack.Screen options={{ title: "Movie Details" }} />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>Loading movie details...</Text>
        </View>
      </>
    );
  }

  if (isError || !movie) {
    return (
      <>
        <Stack.Screen options={{ title: "Movie Details" }} />
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>
            {(error as Error)?.message || "Failed to load movie details"}
          </Text>
        </View>
      </>
    );
  }

  const formatRuntime = (minutes: number | null) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <Stack.Screen options={{ title: screenTitle }} />
      <ScrollView style={styles.container}>
        {movie.backdrop_path && (
          <Image
            source={{ uri: `${BACKDROP_BASE_URL}${movie.backdrop_path}` }}
            style={styles.backdrop}
            resizeMode="cover"
          />
        )}

        <View style={styles.content}>
          <View style={styles.headerSection}>
            {movie.poster_path ? (
              <Image
                source={{ uri: `${POSTER_BASE_URL}${movie.poster_path}` }}
                style={styles.poster}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.poster, styles.noPoster]}>
                <Text style={styles.noPosterText}>No Image</Text>
              </View>
            )}

            <View style={styles.basicInfo}>
              <Text style={styles.title}>{movie.title}</Text>

              <View style={styles.metaRow}>
                <Text style={styles.metaText}>
                  ⭐ {movie.vote_average.toFixed(1)}/10
                </Text>
              </View>

              <View style={styles.metaRow}>
                <Text style={styles.metaText}>
                  📅 {formatDate(movie.release_date)}
                </Text>
              </View>

              <View style={styles.metaRow}>
                <Text style={styles.metaText}>
                  ⏱️ {formatRuntime(movie.runtime)}
                </Text>
              </View>
            </View>
          </View>

          {movie.genres.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Genres</Text>
              <View style={styles.genresContainer}>
                {movie.genres.map((genre) => (
                  <View key={genre.id} style={styles.genreChip}>
                    <Text style={styles.genreText}>{genre.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.overview}>{movie.overview}</Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
  },
  errorText: {
    color: "#cc0000",
    fontSize: 14,
    textAlign: "center",
  },
  backdrop: {
    width: "100%",
    height: 200,
  },
  content: {
    padding: 16,
  },
  headerSection: {
    flexDirection: "row",
    marginBottom: 24,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 8,
  },
  noPoster: {
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  noPosterText: {
    fontSize: 12,
    color: "#666",
  },
  basicInfo: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  metaRow: {
    marginBottom: 6,
  },
  metaText: {
    fontSize: 14,
    color: "#444",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  genresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  genreChip: {
    backgroundColor: "#0066cc",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  genreText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  overview: {
    fontSize: 14,
    lineHeight: 22,
    color: "#333",
  },
});
