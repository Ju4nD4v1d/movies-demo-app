import { Image, StyleSheet, Text, View, ViewStyle } from "react-native";

interface MoviePosterProps {
  posterPath: string | null;
  width: number;
  height: number;
  baseUrl?: string;
  style?: ViewStyle;
}

export function MoviePoster({
  posterPath,
  width,
  height,
  baseUrl = "https://image.tmdb.org/t/p/w500",
  style,
}: MoviePosterProps) {
  if (posterPath) {
    return (
      <Image
        source={{ uri: `${baseUrl}${posterPath}` }}
        style={[styles.poster, { width, height }, style]}
        resizeMode="cover"
      />
    );
  }

  return (
    <View style={[styles.poster, styles.noPoster, { width, height }, style]}>
      <Text style={styles.noPosterText}>No Image</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  poster: {
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
});
