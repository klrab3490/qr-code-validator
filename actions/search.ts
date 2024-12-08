"use server";

import { realtimeDB } from "@/config/firebase";
import { ref, onValue } from "firebase/database";

interface StudentData {
    email: string; // Email address of the student
    foodType: string; // Type of food preference ("Veg" or "Non-Veg")
    name: string; // Name of the student
    srNumber: number; // SR Number
    semester: string; // Semester (e.g., "S8")
    timestamp: string; // Timestamp in ISO format
    food: boolean; // Additional food-related flag
}

export default async function search(detailsId: string): Promise<StudentData> {
    const studentRef = ref(realtimeDB, `Form responses 2/${detailsId}`);
    return new Promise((resolve, reject) => {
        onValue(studentRef, (snapshot) => {
            const data = snapshot.val();
            if (data !== null) {
                resolve(data);
            }
        }, (error) => {
            reject(error);
        });
    });
}