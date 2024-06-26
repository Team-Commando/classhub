package kr.co.chunjae.backend.controller;

import kr.co.chunjae.backend.dto.Question;
import kr.co.chunjae.backend.service.PickerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/picker")
@RequiredArgsConstructor
@Slf4j
public class PickerController {
    private final PickerService pickerService;

    @PostMapping("/save")
    @ResponseStatus(HttpStatus.CREATED)
    public void addQuestionWithChoices(@RequestBody Question question) {
        pickerService.addQuestionWithChoices(question);
    }

    @GetMapping("/get-questions")
    @ResponseStatus(HttpStatus.OK)
    public List<Map<String, Object>> getQuestionsByClassroomIdAndType(@RequestParam("classroomId") int classroomId, @RequestParam("type") int type) {
        List<Map<String, Object>> questions = pickerService.getQuestionsByClassroomIdAndType(classroomId, type);
        return questions;
    }

    @GetMapping("/get-saved-question")
    @ResponseStatus(HttpStatus.OK)
    public Question getQuestionById(@RequestParam("id") int questionId) {
        return pickerService.getQuestionById(questionId);
    }

    @PostMapping("/edit-question")
    @ResponseStatus(HttpStatus.OK)
    public void editQuestionWithChoices(@RequestBody Question question) {
        pickerService.editQuestionWithChoices(question);
    }

    @GetMapping("/delete-question")
    @ResponseStatus(HttpStatus.OK)
    public void deleteQuestionWithChoices(@RequestParam("id") int questionId) {
        pickerService.deleteQuestionWithChoices(questionId);
    }

}
