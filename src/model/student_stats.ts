import { StudentClass } from "./student";
import { groupBy, object_values_to_array_lengths } from "./utils";
import { MapSubTopic, Topic } from "./enums";
export interface YearSection {
  years: string[];
  discipline: string[];
}

export class StudentStats {
  year!: any;
  subtopic!: any;
  theme!: any;

  constructor(students: StudentClass[]) {
    this.year = get_year_breakdown(students);
    this.subtopic = get_topic_breakdown(students);
    this.theme = object_values_to_array_lengths(groupBy(students, "theme"));
  }
}

function get_year_breakdown(students: StudentClass[]) {
  let year_groups = groupBy(students, "year");
  let new_obj = {};
  for (const [key, value] of Object.entries(year_groups)) {
    let test = groupBy(value as StudentClass[], "discipline");
    test = object_values_to_array_lengths(test);
    (new_obj as any)[key] = test;
    console.log(new_obj);
  }
  return new_obj;
}

function get_topic_breakdown(students: StudentClass[]) {
  let topic_groups = groupBy(students, "topic");
  let student_map_stats = {};
  for (const [key, value] of Object.entries(topic_groups)) {
    let subtopic_group = groupBy(value as StudentClass[], "subtopic");
    let all_subtopics = topic_to_array_of_subtopics(
      Topic[key as unknown as keyof typeof Topic]
    );

    subtopic_group = object_values_to_array_lengths(subtopic_group);
    all_subtopics.forEach((st) => {
      if (!(st in subtopic_group)) {
        (subtopic_group as any)[st] = 0;
      }
    });
    (student_map_stats as any)[key] = subtopic_group;
  }
  return student_map_stats;
}

function topic_to_array_of_subtopics(topic: Topic): MapSubTopic[] {
  let topic_subtopics: MapSubTopic[] = [];
  switch (topic) {
    case Topic.BE:
      topic_subtopics = [
        MapSubTopic.INFRASTR,
        MapSubTopic.BUILDINGS,
        MapSubTopic.TRANSPORTATION,
      ];
      break;
    case Topic.EE:
      topic_subtopics = [
        MapSubTopic.WORK,
        MapSubTopic.PROPERTY,
        MapSubTopic.URBANDEV,
      ];
      break;
    case Topic.NE:
      topic_subtopics = [
        MapSubTopic.GREENSPACE,
        MapSubTopic.POLLUTION,
        MapSubTopic.HYDROLOGY,
      ];
      break;
    case Topic.PE:
      topic_subtopics = [
        MapSubTopic.CIVICENG,
        MapSubTopic.GOVERMENT,
        MapSubTopic.POLICY,
      ];
      // topic_subtopics = [MapSubTopic.CIVICENG, MapSubTopic.GOV, MapSubTopic.POLICY];
      break;
    case Topic.SE:
      topic_subtopics = [
        MapSubTopic.EDUCATION,
        MapSubTopic.HEALTHSAFETY,
        MapSubTopic.RACEGEN,
      ];
      break;
  }
  return topic_subtopics;
}

export interface TagStats {
  BE: any;
  EE: any;
  NE: any;
  PE: any;
  SE: any;
}

export interface ThemeStats {
  EQUITY: number;
  ACCESS: number;
  DIVERSITY: number;
}

export interface YearDisciplineStats {
  sixteen: YearGroup;
  eighteen: YearGroup;
}

export interface YearGroup {
  ARTDESIGN: number;
  ARCHITECTURE: number;
  LANDSCAPE: number;
  OTHER: number;
}
