import { StudentClass } from "./student";
import { groupBy, fieldsToFieldLengths } from "../utils";
import { MapSubTopic, Topic } from "../enums";

export interface YearSection {
  years: string[];
  discipline: string[];
}

export class StudentStats {
  year!: any;
  subtopic!: any;
  theme!: any;

  constructor(students: StudentClass[]) {
    this.year = getYearBreakdown(students);
    this.subtopic = getTopicBreakdown(students);
    this.theme = fieldsToFieldLengths(groupBy(students, (s) => s.theme));
  }
}

function getYearBreakdown(students: StudentClass[]) {
  const yearGroups = groupBy(students, (s) => s.year);
  const new_obj = {};
  for (const [key, value] of Object.entries(yearGroups)) {
    let yearBreakdown = groupBy(value as StudentClass[], (s) => s.discipline);
    yearBreakdown = fieldsToFieldLengths(yearBreakdown);
    (new_obj as any)[key] = yearBreakdown;
    console.log(new_obj);
  }
  return new_obj;
}

function getTopicBreakdown(students: StudentClass[]) {
  const topic_groups = groupBy(students, (s) => s.topic);
  const student_map_stats = {};
  for (const [key, value] of Object.entries(topic_groups)) {
    let subtopic_group = groupBy(value as StudentClass[], (s) => s.subtopic);
    const all_subtopics = subtopicsFromTopic(
      Topic[key as unknown as keyof typeof Topic]
    );

    subtopic_group = fieldsToFieldLengths(subtopic_group);
    all_subtopics.forEach((st) => {
      if (!(st in subtopic_group)) {
        (subtopic_group as any)[st] = 0;
      }
    });
    (student_map_stats as any)[key] = subtopic_group;
  }
  return student_map_stats;
}

function subtopicsFromTopic(topic: Topic): MapSubTopic[] {
  let topicSubtopics: MapSubTopic[] = [];
  switch (topic) {
    case Topic.BE:
      topicSubtopics = [
        MapSubTopic.INFRASTR,
        MapSubTopic.BUILDINGS,
        MapSubTopic.TRANSPORTATION,
      ];
      break;
    case Topic.EE:
      topicSubtopics = [
        MapSubTopic.WORK,
        MapSubTopic.PROPERTY,
        MapSubTopic.URBANDEV,
      ];
      break;
    case Topic.NE:
      topicSubtopics = [
        MapSubTopic.GREENSPACE,
        MapSubTopic.POLLUTION,
        MapSubTopic.HYDROLOGY,
      ];
      break;
    case Topic.PE:
      topicSubtopics = [
        MapSubTopic.CIVICENG,
        MapSubTopic.GOVERMENT,
        MapSubTopic.POLICY,
      ];
      // topic_subtopics = [MapSubTopic.CIVICENG, MapSubTopic.GOV, MapSubTopic.POLICY];
      break;
    case Topic.SE:
      topicSubtopics = [
        MapSubTopic.EDUCATION,
        MapSubTopic.HEALTHSAFETY,
        MapSubTopic.RACEGEN,
      ];
      break;
  }
  return topicSubtopics;
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
