package com.luv2code.spring_boot_library.AI;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin("http://localhost:3000")
public class AIController {

    private final BookAIService bookAIService;

    public AIController(BookAIService bookAIService) {
        this.bookAIService = bookAIService;
    }

    @GetMapping("/chat")
    public String chat(@RequestParam String message,
                       @RequestParam(defaultValue = "default") String sessionId) {
        try {
            return bookAIService.chat(sessionId, message);
        } catch (RuntimeException e) {
            if (e.getMessage() != null && e.getMessage().contains("429")) {
                return "I'm sorry, I've reached my request limit for now. Please try again later!";
            }
            if (e.getMessage() != null && e.getMessage().contains("503")) {
                return "I'm currently experiencing high demand. Please try again in a moment!";
            }
            return "Something went wrong. Please try again!";
        }
    }
}