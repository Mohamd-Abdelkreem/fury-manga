import type { Route } from "next";

/**
 * Core domain types for the Fury manga platform.
 */

export interface MangaCardData {
  id: number;
  title: string;
  chapter: string;
  rating: number;
  flag: string;
  image: string;
  isNew?: boolean;
  isHot?: boolean;
  badge?: string;
}

export interface HeroItem {
  id: number;
  title: string;
  titleAccent: string;
  image: string;
  characterImage: string;
  rating: number;
  chapters: string;
  reads: string;
  description: string;
  flag: string;
  genre: string;
  badge: string;
}

export type GenreId =
  | "all"
  | "action"
  | "reincarnation"
  | "revenge"
  | "thriller"
  | "games"
  | "videogames"
  | "adventure"
  | "fantasy"
  | "magic"
  | "comedy"
  | "romance"
  | "horror"
  | "sports"
  | "scifi"
  | "isekai";

export interface Genre {
  id: GenreId;
  label: string;
}

export interface NavLink {
  label: string;
  href: Route;
}
