import {FilterGroup, AuthorDisciplineFilter, TopicSubCategoryFilter, ThemeCategoryFilter, EventLevel, GalleryFilterType, EventType} from './enums'

export type FilterOption =  
    AuthorDisciplineFilter | 
    TopicSubCategoryFilter | 
    ThemeCategoryFilter |
    FilterGroup |
    null;