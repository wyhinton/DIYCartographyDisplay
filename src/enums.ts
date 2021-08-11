/**Major of the student, or their major + year */
export enum AuthorDisciplineFilter {
  ARTDESIGN = "ARTDESIGN",
  ARCHITECTURE = "ARCHITECTURE",
  LANDSCAPE = "LANDSCAPE",
  OTHER = "OTHER",
  ARTDESIGN_2016 = "ARTDESIGN_2016",
  ARTDESIGN_2018 = "ARTDESIGN_2018",
  ARTDESIGN_2020 = "ARTDESIGN_2020",
  ARCHITECTURE_2016 = "ARCHITECTURE_2016",
  ARCHITECTURE_2018 = "ARCHITECTURE_2018",
  ARCHITECTURE_2020 = "ARCHITECTURE_2020",
  OTHER_2016 = "OTHER_2016",
  OTHER_2018 = "OTHER_2018",
  OTHER_2020 = "OTHER_2020",
  LANDSCAPE_2016 = "LANDSCAPE_2016",
  LANDSCAPE_2018 = "LANDSCAPE_2018",
  LANDSCAPE_2020 = "LANDSCAPE_2020",
}
//TODO: FLESH OUT ERROR HANDLING
export enum CustomError {
  STUDENT_MAP_SERIES_NOT_FOUND = "STUDENT_MAP_SERIES_NOT_FOUND",
}
//**Describes the state of a filter category. If the filter is active, then it is SOLO. If some other filter is active, then the filter is DEACTIVATED. If neither of those is true, it is DEFAULT*/
export enum FilterState {
  SOLO = "SOLO",
  DEACTIVATED = "DEACTIVATED",
  DEFAULT = "DEFAULT",
}
//**Describe at which geographic scale the timeline event occurred on. Encodes the "category" field from the events spreadsheet  */
export enum EventLevel {
  national = "national",
  state = "state",
  city = "city",
  // international = "international",
  // NA = "NA",
}
/**Filter groups are used to organize sets of filters. For example, STUDENTS_2016 is used to
get AuthorDisciplineFilter.ARTDESIGN_2016,  AuthorDisciplineFilter.ARTDESIGN_2016, and  AuthorDisciplineFilter.ARCHITECTURE_2016. 
*/
export enum FilterGroup {
  STUDENTS_2016 = "STUDENTS_2016",
  STUDENTS_2018 = "STUDENTS_2018",
  STUDENTS_2020 = "STUDENTS_2020",
  BUILT_TOPIC = "BUILT_TOPIC",
  ECONOMIC_TOPIC = "ECONOMIC_TOPIC",
  NATURAL_TOPIC = "NATURAL_TOPIC",
  POLITICAL_TOPIC = "POLITICAL_TOPIC",
  SOCIAL_TOPIC = "SOCIAL_TOPIC",
  EQUITY_THEME = "EQUITY",
  // EQUITY_THEME = "EQUITY_THEME",
  ACCESS_THEME = "ACCESS",
  DIVERSITY_THEME = "DIVERSITY",
  NONE = "NONE",
  ARCHITECTURE_STUDENTS = "ARCHITECTURE",
  ARTDESIGN_STUDENTS = "ARTDESIGN",
  OTHER_STUDENTS = "OTHER",
  LANDSCAPE_STUDENTS = "LANDSCAPE",
}

export enum EventType {
  DATE = "DATE",
  RANGE = "RANGE",
}

//Correspond to the subtopic value for a student
export enum MapSubTopic {
  //BUILT ENVIRONMENT
  BUILDINGS = "BUILDINGS",
  TRANS = "TRANS",
  INFRASTR = "INFRASTR",
  //NATURAL ENVIRONMENT
  GREENSPACE = "GREENSPACE",
  HYDROLOGY = "HYDROLOGY",
  POLLUTION = "POLLUTION",
  //SOCIAL-CULTURAL ENVIRONMENT
  EDUCATION = "EDUCATION",
  HEALTHSAFETY = "HEALTHSAFETY",
  RACEGEN = "RACEGEN",
  //POLITICAL ENVIRONMENT
  GOVERMENT = "GOVERMENT",
  POLICY = "POLICY",
  CIVICENG = "CIVICENG",
  //ECONOMIC ENVIRONMENT
  WORK = "WORK",
  URBANDEV = "URBANDEV",
  PROPERTY = "PROPERTY",
}

export enum Topic {
  BE = "BE",
  SE = "SE",
  PE = "PE",
  EE = "EE",
  NE = "NE",
}

export enum GalleryFilterType {
  TOPIC,
  DISCIPLINE,
  THEME,
  FILTERGROUP,
  FILTERGROUP_TOPIC,
  FILTERGROUP_YEAR,
}
export enum ThemeCategoryFilter {
  EQUITY = "EQUITY",
  ACCESS = "ACCESS",
  DIVERSITY = "DIVERSITY",
}
