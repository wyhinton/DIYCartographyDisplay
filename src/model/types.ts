import {
  FilterGroup,
  AuthorDisciplineFilter,
  MapSubTopic,
  ThemeCategoryFilter,
} from "../enums";

export type FilterOption =
  | AuthorDisciplineFilter
  | MapSubTopic
  | ThemeCategoryFilter
  | FilterGroup
  | null;
