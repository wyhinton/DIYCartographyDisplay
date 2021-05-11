import {
  FilterGroup,
  AuthorDisciplineFilter,
  MapSubTopic,
  ThemeCategoryFilter,
  EventLevel,
  GalleryFilterType,
  EventType,
} from "./enums";

export type FilterOption =
  | AuthorDisciplineFilter
  | MapSubTopic
  | ThemeCategoryFilter
  | FilterGroup
  | null;
