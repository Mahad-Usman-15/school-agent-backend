import fetch from "node-fetch";

const SCHOOL_CONTEXT = `
1. School Overview
Name: XYZ School
Established: 2010
Location: ABC City, Country
Type: Private Preschool & Primary School
Grades Offered: Pre-Nursery to Grade 5
Teaching Philosophy: Holistic, child-centered, inquiry-based learning

Summary:
XYZ School is a modern, student-centered institution committed to academic excellence, character building, and developing lifelong learners. The school combines proven educational methods with creative, experiential learning.

2. Mission, Vision & Values
Mission

To nurture confident, curious, and compassionate learners by providing a safe, inclusive, and inspiring learning environment.

Vision

To be a leading institution that empowers children to discover their potential and make a positive impact on their community and the world.

Core Values

Respect

Integrity

Creativity

Responsibility

Collaboration

Lifelong learning

3. Leadership & Administration
Founder & Principal — Mr. Ahmed Khan

20+ years of experience in early childhood and primary education

Known for child-centered learning and teacher mentorship

Vice Principal — Ms. Sarah Iqbal

Master's in Educational Leadership

Oversees curriculum development, teacher training, and student support

Operations Manager — Mr. Farhan Ali

Manages admissions, logistics, IT, fees, campus operations, and parent communication

4. Academic Program
Curriculum Approach

XYZ School follows a blended approach combining:

National curriculum (core subjects)

Inquiry-based learning

Play-based early years curriculum

Skill-building projects

Subjects Offered

English

Mathematics

Science

Social Studies

Computer Studies

Islamic & Moral Education

Art & Design

Physical Education

Music & Performing Arts

Teaching Methods

Group learning

Project-based activities

Hands-on experiments

Story-based learning

Technology-assisted learning

5. Early Years Program (Pre-Nursery – KG)

Focus on:

Language development

Fine & gross motor skills

Early numeracy

Sensory play

Social & emotional learning

Music and movement

Daily routine includes:

Circle time

Free play

Structured learning centers

Outdoor activities

Storytelling

6. Primary Program (Grades 1–5)

Focus on:

Strong foundation in core academics

Problem-solving & reasoning

Creative writing

Science experiments

ICT skills

Group projects

Public speaking

7. Facilities

XYZ School offers:

Purpose-built classrooms

Science corner / mini-lab

Computer lab

Library

Indoor play area

Outdoor playground

Art & activity room

CCTV-monitored safe campus

Air-conditioned classrooms

Smart boards (selected classrooms)

8. Extracurricular Activities

The school offers a variety of clubs such as:

Robotics Club

Art & Craft Club

Reading Club

Coding for Kids

Public Speaking Club

Sports: Football, Basketball, Martial Arts

Music & Drama Club

9. Parent Communication

XYZ School communicates through:

School App / Portal

Monthly newsletters

Parent-teacher meetings (PTMs)

WhatsApp alerts for emergencies

Homework & class updates through digital platforms

10. Admissions Policy
Admission Steps

Online or onsite form submission

Parent interview / counseling

Child assessment (age-appropriate)

Document submission

Fee voucher issuance

Confirmation of admission

Required Documents

Birth certificate

CNIC copies of parents

Previous school report (if applicable)

2 passport-size photos

11. Fee Structure (General Template)

(You can ask me to generate a realistic fee structure.)

Fees usually include:

Admission fee

Monthly tuition fee

Annual resources fee

Uniform & books (purchased separately)

12. Attendance & Discipline Policies
Attendance

Minimum 80% required per term

Parents must inform the school about absences

Discipline Policy

Positive reinforcement

Zero tolerance for bullying

Respect for teachers and peers

Uniform compliance

13. Safety & Health Policies

XYZ School ensures:

CCTV-surveilled campus

Verified teachers & staff

First-aid trained staff

Emergency evacuation plan

Clean drinking water

Secure student pick-up system

14. School Timings

Early Years: 8:30 AM – 12:30 PM

Primary: 8:00 AM – 2:00 PM

Saturday: Closed

Sunday: Closed
`;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const userMessage = req.body.message;
  if (!userMessage) return res.status(400).json({ error: "Missing 'message'" });

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: `You are a school agent always use this knowledge base to answer user queries,School info:\n${SCHOOL_CONTEXT}\nUser: ${userMessage}` }
              ]
            }
          ]
        }),
      }
    );

    const data = await response.json();
    return res.json({
      reply: data.candidates?.[0]?.content?.parts?.[0]?.text || "Could not generate response."
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
