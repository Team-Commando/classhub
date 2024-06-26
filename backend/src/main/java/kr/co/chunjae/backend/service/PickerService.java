package kr.co.chunjae.backend.service;

import kr.co.chunjae.backend.dto.Question;
import kr.co.chunjae.backend.mapper.PickerMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class PickerService {

    private final PickerMapper pickerMapper;

    @Transactional
    public void addQuestionWithChoices(Question question) {
        pickerMapper.insertQuestion(question);
        int questionId = question.getId();

        for (String choiceText : question.getChoices()) {
            pickerMapper.insertChoice(questionId, choiceText);
        }
    }

    public List<Map<String, Object>> getQuestionsByClassroomIdAndType(int classroomId, int type) {
        return pickerMapper.selectQuestionsByClassroomIdAndType(classroomId, type);
    }

    public Question getQuestionById(int questionId) {
        return pickerMapper.selectQuestionById(questionId);
    }

    @Transactional
    public void editQuestionWithChoices(Question question) {
        pickerMapper.updateQuestion(question);
        int questionId = question.getId();

        // 기존 선택지 삭제
        pickerMapper.deleteChoicesByQuestionId(questionId);

        // 새로운 선택지 삽입
        for (String choiceText : question.getChoices()) {
            pickerMapper.insertChoice(questionId, choiceText);
        }
    }
    @Transactional
    public void deleteQuestionWithChoices(int questionId) {
        // 선택지 삭제
        pickerMapper.deleteChoicesByQuestionId(questionId);
        // 질문삭제
        pickerMapper.deleteQuestionByQuestionId(questionId);
    }
}
