package com.luv2code.spring_boot_library.AI;

import com.luv2code.spring_boot_library.Dao.BookRepository;
import com.luv2code.spring_boot_library.Entities.Book;
import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.Metadata;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.embedding.onnx.allminilml6v2.AllMiniLmL6V2EmbeddingModel;
import dev.langchain4j.model.googleai.GoogleAiGeminiChatModel;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.inmemory.InMemoryEmbeddingStore;
import dev.langchain4j.rag.content.retriever.EmbeddingStoreContentRetriever;
import dev.langchain4j.service.AiServices;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookAIService {

    private final BookRepository bookRepository;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${gemini.model.name}")
    private String geminiModelVersion;

    private BookAssistant assistant;

    public BookAIService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    // This interface is all LangChain4j needs to create a full AI assistant
    interface BookAssistant {
        String chat(@dev.langchain4j.service.MemoryId String memoryId,
                    @dev.langchain4j.service.UserMessage String userMessage);
    }

    @PostConstruct
    public void init() {
        // Step 1 - Load all books from DB
        List<Book> books = bookRepository.findAll();

        // Step 2 - Convert each book into a text document for RAG
        EmbeddingStore<TextSegment> embeddingStore = new InMemoryEmbeddingStore<>();
        EmbeddingModel embeddingModel = new AllMiniLmL6V2EmbeddingModel();

        for (Book book : books) {
            String content = String.format(
                    "Title: %s | Author: %s | Category: %s | Description: %s | Available copies: %d",
                    book.getTitle(),
                    book.getAuthor(),
                    book.getCategory(),
                    book.getDescription(),
                    book.getCopiesAvailable()
            );
            TextSegment segment = TextSegment.from(content,
                    Metadata.from("bookId", book.getId().toString()));
            var embedding = embeddingModel.embed(segment).content();
            embeddingStore.add(embedding, segment);
        }

        // Step 3 - Build Gemini model
        var geminiModel = GoogleAiGeminiChatModel.builder()
                .apiKey(geminiApiKey)
                .modelName(geminiModelVersion)
                .build();

        // Step 4 - Build RAG retriever
        var retriever = EmbeddingStoreContentRetriever.builder()
                .embeddingStore(embeddingStore)
                .embeddingModel(embeddingModel)
                .maxResults(5)
                .build();

        // Step 5 - Wire everything together
        assistant = AiServices.builder(BookAssistant.class)
                .chatLanguageModel(geminiModel)
                .contentRetriever(retriever)
                .chatMemoryProvider(memoryId -> MessageWindowChatMemory.withMaxMessages(10))
                .systemMessageProvider(chatMemoryId ->
                        "You are a helpful library assistant. " +
                                "Answer ONLY what the user specifically asks. " +
                                "Never list books unless the user explicitly asks for a list. " +
                                "Answer questions about books in a clean, friendly and concise way. " +
                                "Never use markdown formatting like ** or *. " +
                                "Use plain simple sentences. " +
                                "For greetings or thanks, respond naturally without mentioning books.")
                .build();

    }

    public String chat(String sessionId, String userMessage) {
        return assistant.chat(sessionId, userMessage);
    }
}