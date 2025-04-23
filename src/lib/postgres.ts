"use server";

import { createClient } from "@/utils/supabase/server";

/**
 * Fetch list of colleges
 */
export async function getColleges() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("colleges")
    .select("id, name")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching colleges:", error.message);
    throw new Error(error.message);
  }
  return data;
}

/**
 * Add a new college to the colleges table
 */
export async function addCollege(collegeName: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("colleges")
    .insert([{ name: collegeName }]);

  if (error) {
    console.error("Error adding college:", error.message);
    if (error.code === "23505") {
      // Duplicate college name (unique constraint violation)
      throw new Error("College already exists.");
    }
    throw new Error(error.message);
  }

  return { success: true, message: "College added successfully." };
}

/**
 * Add a new user profile
 */
export async function createUserProfile({
  userId,
  fullName,
  collegeId,
}: {
  userId: string;
  fullName: string;
  collegeId: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase.from("profiles").insert([
    {
      id: userId,
      full_name: fullName,
      college_id: collegeId,
    },
  ]);

  if (error) {
    console.error("Error fetching colleges:", error.message);
    throw new Error(error.message);
  }

  return { success: true };
}

export async function getUserProfile(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select(
      `
        id,
        full_name,
        college_id,
        college:colleges (
          id,
          name
        )
      `
    )

    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error.message);
    throw new Error(error.message);
  }
  return data;
}

/**
 * Create a new course for user
 */
export async function createCourse({
  userId,
  courseName,
  courseCode,
}: {
  userId: string;
  courseName: string;
  courseCode: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase.from("courses").insert([
    {
      user_id: userId,
      course_name: courseName,
      course_code: courseCode,
    },
  ]);

  if (error) {
    console.error("Error creating course:", error.message);
    throw new Error(error.message);
  }
  return { success: true };
}

/**
 * Update course details
 */
export async function updateCourse({
  courseId,
  courseName,
  courseCode,
}: {
  courseId: string;
  courseName: string;
  courseCode: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("courses")
    .update({
      course_name: courseName,
      course_code: courseCode,
    })
    .eq("id", courseId);

  if (error) {
    console.error("Error updating course:", error.message);
    throw new Error(error.message);
  }
  return { success: true };
}

/**
 * Delete a course
 */
export async function deleteCourse(courseId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("courses").delete().eq("id", courseId);

  if (error) {
    console.error("Error deleting course:", error.message);
    throw new Error(error.message);
  }
  return { success: true };
}
