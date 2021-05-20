import type { Student } from "../map_data";
export interface MapStats {
  year: any;
  subtopic: any;
  theme: any;
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

export function generate_map_stats(students: Student[]) {
  // export function generate_map_stats(students: Student[]): MapStats {
  let stats: MapStats;
  //   return stats;
}

// function generate_year_discpline_stats(
//   map_rows: RawStudentRowValues[]
// ): YearDisciplineStats {
//   const year_groups = groupBy(map_rows, "year");
//   const yg_keys = Object.keys(year_groups);
//   const max_unit_count = 10;

//   const year_group = yg_keys.map((k: any, i: number) => {
//     const year_breakdown = groupBy(year_groups[k], "discipline");
//     let cats = Object.keys(year_breakdown);
//     let final_data: any = {};
//     cats.forEach((c) => {
//       final_data[c] = Math.round(
//         (year_breakdown[c].length / year_groups[yg_keys[i]].length) *
//           max_unit_count
//       );
//     });
//     return final_data;
//   });
//   const final_data: any = {};
//   console.log(year_group);
//   year_group.forEach((s, ind) => {
//     final_data[yg_keys[ind]] = s;
//   });
//   let fomratted_data = final_data as YearDisciplineStats;
//   return fomratted_data;
// }

// function generate_topic_stats(map_rows: RawStudentRowValues[]): TagStats {
//   const total_cat_blocks = 75;
//   const topic_groups = groupBy(map_rows, "tags");
//   let empty_cont: any = {};
//   let keys = Object.keys(topic_groups);
//   keys.forEach((k) => {
//     const topic_group_count = topic_groups[k].length;
//     const sub_groups = groupBy(topic_groups[k], "subtopic");
//     const cat_percent = topic_groups[k].length / map_rows.length;
//     const portioned_cat_blocks = cat_percent * total_cat_blocks;
//     let empty_sg: any = {
//       cat_percent: topic_groups[k].length / map_rows.length,
//       cat_blocks: portioned_cat_blocks,
//     };
//     const sub_keys = Object.keys(sub_groups);
//     sub_keys.forEach((sk) => {
//       empty_sg[sk] = Math.round(
//         ((Math.ceil(((sub_groups[sk].length / topic_group_count) * 100) / 20) *
//           20) /
//           100) *
//           5
//       );
//     });
//     empty_cont[k] = empty_sg;
//   });

//   return empty_cont as TagStats;
// }

// function generate_theme_stats(map_rows: RawStudentRowValues[]): any {
//   const num_theme_blocks = 25;
//   //max number of blocks is 45
//   const theme_groups = groupBy(map_rows, "theme");
//   const theme_keys = Object.keys(theme_groups);
//   let empty_theme_data: any = {};

//   theme_keys.forEach((k) => {
//     empty_theme_data[k] = Math.round(
//       (theme_groups[k].length / map_rows.length) * num_theme_blocks
//     );
//     // empty_theme_data[k] = theme_groups[k].length/map_rows.length
//   });
//   return empty_theme_data as ThemeStats;
// }
