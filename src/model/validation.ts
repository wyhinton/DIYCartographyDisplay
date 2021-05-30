//tutorial on fp-ts: https://dev.to/gcanti/getting-started-with-fp-ts-either-vs-validation-5eja
// https://rlee.dev/practical-guide-to-fp-ts-part-5
// https://github.com/zanza00/learn-fp-ts/blob/master/examples/taskeither/with-io-ts/src/example.ts
// https://codesandbox.io/s/array-of-validators-vxgj6?from-embed=&file=/src/arrayOfValidators.ts:197-244
// https://github.com/inato/fp-ts-cheatsheet
import { getSemigroup } from "fp-ts/lib/NonEmptyArray";
import { NonEmptyArray } from "fp-ts/lib/NonEmptyArray";
import { pipe } from "fp-ts/lib/function";
import { sequenceT } from "fp-ts/lib/Apply";
import { Predicate } from "fp-ts/lib/function";
import { sequence } from "fp-ts/lib/Array";
// import { sequenceS } from "fp-ts/lib/Apply";
import * as A from "fp-ts/lib/Array";
import * as E from "fp-ts/lib/Either";
import type { RawStudentRowValues } from "./sheet_data_models";
import { fold } from "fp-ts/lib/Either";
import { ActionCreator, ThunkCreator } from "easy-peasy";

import {
  Either,
  left,
  right,
  mapLeft,
  getApplicativeValidation,
} from "fp-ts/lib/Either";

function lift<E, A>(
  check: (a: A) => Either<E, A>
): (a: A) => Either<NonEmptyArray<E>, A> {
  return (a) =>
    pipe(
      check(a),
      mapLeft((a) => [a])
    );
}

const minLength = (
  s: RawStudentRowValues
): Either<string, RawStudentRowValues> =>
  s.title.length >= 100 ? right(s) : left("at least 6 characters");

const minLengthV = lift(minLength);

export function validate_student_row(
  row: RawStudentRowValues
): Either<NonEmptyArray<string>, RawStudentRowValues> {
  let test = pipe(
    sequenceT(getApplicativeValidation(getSemigroup<string>()))(
      minLengthV(row as RawStudentRowValues)
    ),
    E.map((a) => row)
  );
  //   let t2 = fold(replyUnauthorized(test), replyToken(test));
  return test;
}

export type ValidationError = NonEmptyArray<string>;

export type ValidationResult<T> = E.Either<ValidationError, T>;

export type ValidationsResult<T> = E.Either<ValidationError, T>;

export interface Validator<T> {
  (x: T): ValidationResult<T>;
}

const applicativeV = E.getApplicativeValidation(getSemigroup<string>());

export const validateStudentData: (
  validations: Array<Validator<RawStudentRowValues>>,
  value: RawStudentRowValues
  //   value: unknown
) => ValidationsResult<RawStudentRowValues> = (validations, value) =>
  validations.length
    ? pipe(
        sequence(applicativeV)(validations.map((afb) => afb(value))),
        E.map(() => value as RawStudentRowValues)
      )
    : E.right(value as RawStudentRowValues);

const stringLengthPredicate: Predicate<RawStudentRowValues> = (v) =>
  v.title.length > 4;
//   typeof v === "string" && v.length > 4;

export const lengthAtLeastFour: Validator<RawStudentRowValues> =
  E.fromPredicate(stringLengthPredicate, () => [
    "value must be a string of at least 5 characters",
  ]);

const requiredLetterPredicate: Predicate<RawStudentRowValues> = (v) =>
  v.title.includes("t");
// typeof v == RawStudentRowValues && v.i

export const hasLetterT: Validator<RawStudentRowValues> = E.fromPredicate(
  requiredLetterPredicate,
  () => ['value must be a string that includes the letter "t"']
);

export function handle_validation(
  row: RawStudentRowValues,
  validators: Validator<RawStudentRowValues>[],
  on_error: ActionCreator<ValidationError>,
  on_success: ThunkCreator<RawStudentRowValues>
) {
  let test = validateStudentData(validators, row);
  console.log("got to test validate func");
  const on_error_container = (n: ValidationError) => {
    on_error(n);
    console.error("got error");
    console.log(n);
  };
  const on_sucess_container = (n: RawStudentRowValues) => {
    on_success(n);
    // actions.my_test_action(n);
    console.log("got good");
    console.log(n);
  };
  let validation_sequence = E.bimap(on_error_container, on_sucess_container);
  validation_sequence(test);
}

// console.log(validateName(validations, "sim"));
// {left: ['value must be a string that includes the letter "t"', 'value must be a string of at least 4 characters']}

// console.log(validateName(validations, "timmy"));
// {right: 'timmy'}

// export interface RawStudentRowValues {
//     title: string;
//     info: string;
//     author: string;
//     topic: string;
//     discipline: string;
//     theme: string;
//     series0101: string;
//     series0102: string;
//     series0201: string;
//     series0202: string;
//     series0301: string;
//     series0302: string;
//     // photo1: string;
//     // photo2: string;
//     // photo3: string;
//     // photo4: string;
//     // photo5: string;
//     thumbnail: string;
//     year: string;
//     subtopic: string;
//   }
// console.log(validateName(validations, "sim"));
// {left: ['value must be a string that includes the letter "t"', 'value must be a string of at least 4 characters']}

// console.log(validateName(validations, "timmy"));
// {right: 'timmy'}

// function replyUnauthorized(
//   val: E.Either<NonEmptyArray<string>, RawStudentRowValues>
// ): (error: Error) => string {
//   return (error) => "it was unauthorized";
// }

// function replyToken(
//   val: E.Either<NonEmptyArray<string>, RawStudentRowValues>
// ): (token: string) => RawStudentRowValues {
//   return (token) => token;
// }
