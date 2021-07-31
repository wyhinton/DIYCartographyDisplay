import { StudentClass } from "./student";
import { groupBy, fieldsToFieldLengths } from "../utils";
import { AuthorDisciplineFilter, MapSubTopic, Topic } from "../enums";

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
  const yearBreakdown = {};
  for (const [key, value] of Object.entries(yearGroups)) {
    let studentsByDiscipline = groupBy(
      value as StudentClass[],
      (s) => s.discipline
    );
    // console.log(studentsByDiscipline);
    const disciplines = [
      AuthorDisciplineFilter.ARTDESIGN,
      AuthorDisciplineFilter.ARCHITECTURE,
      AuthorDisciplineFilter.OTHER,
      AuthorDisciplineFilter.LANDSCAPE,
    ];
    //if there are no students of a discipline in a year, provide an empty array so that the discipline has a student count of 0
    disciplines.forEach((dis) => {
      if (!studentsByDiscipline[dis]) {
        studentsByDiscipline[dis] = [];
      }
    });
    //transform the arrays of students into a count of the number of students
    const disciplinesByStudentCount =
      fieldsToFieldLengths(studentsByDiscipline);
    //for each year, insert this counter object
    (yearBreakdown as any)[key] = disciplinesByStudentCount as YearGroup;
    console.log(yearBreakdown);
  }
  return yearBreakdown;
}

function getTopicBreakdown(students: StudentClass[]) {
  const topicGroups = groupBy(students, (s) => s.topic);
  const studentMapStats = {};
  for (const [key, value] of Object.entries(topicGroups)) {
    let subtopicGroup = groupBy(value as StudentClass[], (s) => s.subtopic);
    const all_subtopics = subtopicsFromTopic(
      Topic[key as unknown as keyof typeof Topic]
    );

    subtopicGroup = fieldsToFieldLengths(subtopicGroup);
    all_subtopics.forEach((st) => {
      if (!(st in subtopicGroup)) {
        (subtopicGroup as any)[st] = 0;
      }
    });
    (studentMapStats as any)[key] = subtopicGroup;
  }
  return studentMapStats;
}

function subtopicsFromTopic(topic: Topic): MapSubTopic[] {
  let topicSubtopics: MapSubTopic[] = [];
  switch (topic) {
    case Topic.BE:
      topicSubtopics = [
        MapSubTopic.INFRASTR,
        MapSubTopic.BUILDINGS,
        MapSubTopic.TRANS,
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
