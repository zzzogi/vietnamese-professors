"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EmailFormProps {
  userBackground: string;
  setUserBackground: (value: string) => void;
  intention: string;
  setIntention: (value: string) => void;
  topic: string;
  setTopic: (value: string) => void;
  tone: string;
  setTone: (value: string) => void;
  language: "en" | "vi";
  setLanguage: (value: "en" | "vi") => void;
}

export function EmailForm({
  userBackground,
  setUserBackground,
  intention,
  setIntention,
  topic,
  setTopic,
  tone,
  setTone,
  language,
  setLanguage,
}: EmailFormProps) {
  return (
    <div className="space-y-4">
      {/* Language Selection */}
      <div>
        <Label>Language / Ngôn ngữ</Label>
        <Select
          value={language}
          onValueChange={(val) => setLanguage(val as "en" | "vi")}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="vi">Tiếng Việt</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Your Background */}
      <div>
        <Label htmlFor="background">
          {language === "en"
            ? "Your Background (Optional)"
            : "Bối cảnh của bạn (Tùy chọn)"}
        </Label>
        <Textarea
          id="background"
          placeholder={
            language === "en"
              ? "E.g., I'm a final-year CS student..."
              : "VD: Tôi là sinh viên năm cuối ngành CNTT..."
          }
          value={userBackground}
          onChange={(e) => setUserBackground(e.target.value)}
          rows={3}
          className="mt-1"
        />
      </div>

      {/* Intention */}
      <div>
        <Label htmlFor="intention">
          {language === "en"
            ? "Your Intention (Optional)"
            : "Mục đích (Tùy chọn)"}
        </Label>
        <Select value={intention} onValueChange={setIntention}>
          <SelectTrigger>
            <SelectValue
              placeholder={language === "en" ? "Select..." : "Chọn..."}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="research">
              {language === "en" ? "Research Opportunity" : "Cơ hội nghiên cứu"}
            </SelectItem>
            <SelectItem value="phd">
              {language === "en" ? "PhD Application" : "Ứng tuyển PhD"}
            </SelectItem>
            <SelectItem value="collaboration">
              {language === "en"
                ? "Research Collaboration"
                : "Hợp tác nghiên cứu"}
            </SelectItem>
            <SelectItem value="internship">
              {language === "en" ? "Internship" : "Thực tập"}
            </SelectItem>
            <SelectItem value="advice">
              {language === "en" ? "Academic Advice" : "Tư vấn học thuật"}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Specific Topic */}
      <div>
        <Label htmlFor="topic">
          {language === "en"
            ? "Specific Topic (Optional)"
            : "Chủ đề cụ thể (Tùy chọn)"}
        </Label>
        <Input
          id="topic"
          placeholder={
            language === "en"
              ? "E.g., Machine Learning in Healthcare"
              : "VD: Machine Learning trong Y tế"
          }
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="mt-1"
        />
      </div>

      {/* Tone */}
      <div>
        <Label>{language === "en" ? "Tone" : "Giọng điệu"}</Label>
        <Select value={tone} onValueChange={setTone}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="formal">
              {language === "en" ? "Formal" : "Trang trọng"}
            </SelectItem>
            <SelectItem value="semiformal">
              {language === "en" ? "Semi-formal" : "Vừa phải"}
            </SelectItem>
            <SelectItem value="friendly">
              {language === "en" ? "Friendly" : "Thân thiện"}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
