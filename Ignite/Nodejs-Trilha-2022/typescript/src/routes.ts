import { Request, Response } from "express";
import CreateCourseService from "./CreateCourseService";

export function createCourse(request: Request, response: Response) {
    CreateCourseService.execute({
        name: "NodeJS", 
        duration: 10, 
        educator: "Gustavo"
    });

    CreateCourseService.execute({
        name: "ReactJS", 
        // duration: 10, 
        educator: "Gustavo"
    });

    return response.send("Ok");
}