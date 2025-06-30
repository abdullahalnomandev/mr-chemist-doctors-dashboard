/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { MoveDown, MoveUp, PlusCircle, Trash2 } from "lucide-react";
import {
  useFieldArray,
  useFormContext,
  type UseFieldArrayReturn,
} from "react-hook-form";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { OptionItem } from "./option-item";
import { ConsultationFormData, QuestionType } from "./types";

interface QuestionItemProps {
  stepIndex: number;
  questionIndex: number;
  questionsFieldArray: UseFieldArrayReturn<
    ConsultationFormData,
    `steps.${number}.questions`,
    "id"
  >;
}

export function QuestionItem({
  stepIndex,
  questionIndex,
  questionsFieldArray,
}: QuestionItemProps) {
  const form = useFormContext<ConsultationFormData>();

  // Field array for options in this question
  const optionsFieldArray = useFieldArray({
    control: form.control,
    name: `steps.${stepIndex}.questions.${questionIndex}.options`,
  });

  const questionType = form.watch(
    `steps.${stepIndex}.questions.${questionIndex}.type`
  ) as QuestionType;

  return (
    <AccordionItem
      value={`question-${stepIndex}-${questionIndex}`}
      className='border border-border rounded-md mb-4'>
      <AccordionTrigger className='px-4 py-3 bg-secondary rounded-t-md hover:bg-secondary/80 transition-colors'>
        <div className='flex items-center justify-between w-full'>
          <span className='font-medium'>
            {form.watch(
              `steps.${stepIndex}.questions.${questionIndex}.question`
            ) || `Question ${questionIndex + 1}`}
          </span>
          <div className='flex items-center gap-2'>
            {questionIndex > 0 && (
              <div
                role='button'
                tabIndex={0}
                className='p-1 rounded-md hover:bg-accent'
                onClick={(e) => {
                  e.stopPropagation();
                  questionsFieldArray.move(questionIndex, questionIndex - 1);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    questionsFieldArray.move(questionIndex, questionIndex - 1);
                  }
                }}>
                <MoveUp className='h-4 w-4' />
              </div>
            )}
            {questionIndex < questionsFieldArray.fields.length - 1 && (
              <div
                role='button'
                tabIndex={0}
                className='p-1 rounded-md hover:bg-accent'
                onClick={(e) => {
                  e.stopPropagation();
                  questionsFieldArray.move(questionIndex, questionIndex + 1);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    questionsFieldArray.move(questionIndex, questionIndex + 1);
                  }
                }}>
                <MoveDown className='h-4 w-4' />
              </div>
            )}
            <div
              role='button'
              tabIndex={0}
              className='p-1 rounded-md hover:bg-accent'
              onClick={(e) => {
                e.stopPropagation();
                questionsFieldArray.remove(questionIndex);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  questionsFieldArray.remove(questionIndex);
                }
              }}>
              <Trash2 className='h-4 w-4 text-red-500' />
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className='px-4 pt-4 pb-2 space-y-4 bg-white rounded-b-md'>
        <Card>
          <CardContent className='pt-6'>
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name={`steps.${stepIndex}.questions.${questionIndex}.id`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`steps.${stepIndex}.questions.${questionIndex}.questionCode`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question Code</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card className='border-border'>
          <CardContent className='pt-6'>
            <FormField
              control={form.control}
              name={`steps.${stepIndex}.questions.${questionIndex}.type`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select question type' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='yesNo'>Yes/No</SelectItem>
                      <SelectItem value='text'>Text</SelectItem>
                      <SelectItem value='textarea'>Text Area</SelectItem>
                      <SelectItem value='checkbox'>Checkbox</SelectItem>
                      <SelectItem value='radio'>Radio</SelectItem>
                      <SelectItem value='select'>Select</SelectItem>
                      <SelectItem value='date'>Date</SelectItem>
                      <SelectItem value='number'>Number</SelectItem>
                      <SelectItem value='checkboxGroup'>
                        Checkbox Group
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`steps.${stepIndex}.questions.${questionIndex}.question`}
              render={({ field }) => (
                <FormItem className='mt-4'>
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card className='border-border'>
          <CardContent className='pt-6'>
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name={`steps.${stepIndex}.questions.${questionIndex}.required`}
                render={({ field }) => (
                  <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className='space-y-1 leading-none'>
                      <FormLabel>Required</FormLabel>
                      <FormDescription>
                        Is this question required?
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`steps.${stepIndex}.questions.${questionIndex}.position`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name={`steps.${stepIndex}.questions.${questionIndex}.description`}
              render={({ field }) => (
                <FormItem className='mt-4'>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card className='border-border'>
          <CardContent className='pt-6'>
            <FormField
              control={form.control}
              name={`steps.${stepIndex}.questions.${questionIndex}.treatmentTypes`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Treatment Types</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Comma-separated treatment types'
                      value={field.value?.join(", ") || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(
                          value
                            ? value.split(",").map((item) => item.trim())
                            : []
                        );
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter treatment types separated by commas
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card className='border-border'>
          <CardContent className='pt-6'>
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name={`steps.${stepIndex}.questions.${questionIndex}.placeholder`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Placeholder</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`steps.${stepIndex}.questions.${questionIndex}.label`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Label</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='grid grid-cols-2 gap-4 mt-4'>
              <FormField
                control={form.control}
                name={`steps.${stepIndex}.questions.${questionIndex}.prefix`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prefix</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`steps.${stepIndex}.questions.${questionIndex}.suffix`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Suffix</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Conditional fields based on question type */}
        {["radio", "select", "checkboxGroup"].includes(questionType) && (
          <Card className='border-border'>
            <CardContent className='pt-6'>
              {questionType === "checkboxGroup" && (
                <FormField
                  control={form.control}
                  name={`steps.${stepIndex}.questions.${questionIndex}.allowMultiple`}
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mb-4'>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className='space-y-1 leading-none'>
                        <FormLabel>Allow Multiple</FormLabel>
                        <FormDescription>
                          Allow selecting multiple options?
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name={`steps.${stepIndex}.questions.${questionIndex}.noneOption`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>None Option</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='e.g., None of the above' />
                    </FormControl>
                    <FormDescription>
                      Text for a none option, if needed
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Options Section */}
              <div className='mt-6'>
                <div className='flex items-center justify-between mb-4'>
                  <h5 className='text-sm font-medium'>Options</h5>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() =>
                      optionsFieldArray.append({
                        id: Date.now(),
                        value: "",
                        label: "",
                        position: optionsFieldArray.fields.length,
                      })
                    }>
                    <PlusCircle className='mr-2 h-4 w-4' />
                    Add Option
                  </Button>
                </div>

                <div className='space-y-2 bg-secondary p-3 rounded-md'>
                  {optionsFieldArray.fields.length === 0 ? (
                    <p className='text-sm text-center py-2'>
                      No options added yet
                    </p>
                  ) : (
                    optionsFieldArray.fields.map((optionField, optionIndex) => (
                      <OptionItem
                        key={optionField.id}
                        stepIndex={stepIndex}
                        questionIndex={questionIndex}
                        optionIndex={optionIndex}
                        optionsFieldArray={optionsFieldArray}
                      />
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Conditional Questions for Yes/No type */}
        {questionType === "yesNo" && (
          <Card className='border-border'>
            <CardContent className='pt-6'>
              <h5 className='text-sm font-medium mb-4'>
                Conditional Questions
              </h5>

              <div className='space-y-4 bg-slate-50 p-4 rounded-md mb-4'>
                <h6 className='text-xs font-medium'>If Yes:</h6>
                <FormField
                  control={form.control}
                  name={`steps.${stepIndex}.questions.${questionIndex}.conditionalQuestions.yes`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Enter conditional questions for 'Yes' response (JSON format)"
                          {...field}
                          value={
                            field.value
                              ? JSON.stringify(field.value, null, 2)
                              : ""
                          }
                          onChange={(e) => {
                            try {
                              const value = e.target.value
                                ? JSON.parse(e.target.value)
                                : [];
                              field.onChange(value);
                              // @ts-ignore
                            } catch {
                              // Handle JSON parse error
                              field.onChange(e.target.value);
                            }
                          }}
                          className='font-mono text-sm'
                        />
                      </FormControl>
                      <FormDescription>
                        Enter conditional questions in JSON format
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='space-y-4 bg-slate-50 p-4 rounded-md'>
                <h6 className='text-xs font-medium'>If No:</h6>
                <FormField
                  control={form.control}
                  name={`steps.${stepIndex}.questions.${questionIndex}.conditionalQuestions.no`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Enter conditional questions for 'No' response (JSON format)"
                          {...field}
                          value={
                            field.value
                              ? JSON.stringify(field.value, null, 2)
                              : ""
                          }
                          onChange={(e) => {
                            try {
                              const value = e.target.value
                                ? JSON.parse(e.target.value)
                                : [];
                              field.onChange(value);
                            } catch {
                              // Handle JSON parse error
                              field.onChange(e.target.value);
                            }
                          }}
                          className='font-mono text-sm'
                        />
                      </FormControl>
                      <FormDescription>
                        Enter conditional questions in JSON format
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
