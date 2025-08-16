// src/stores/news.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue'; // Import ref และ computed เข้ามา
import apiClient from '../services/NewsService'; // Import apiClient เข้ามาใช้งาน

// 1. กำหนด Interfaces สำหรับโครงสร้างข้อมูล (เหมือนเดิม)
export interface Comment {
  id: number;
  user: string;
  text: string;
  image: string | null;
  time: string;
  vote: 'real' | 'fake';
}

export interface News {
  id: number;
  topic: string;
  shortDetail: string;
  fullDetail: string;
  image: string;
  reporter: string;
  dateTime: string;
  voteSummary: {
    real: number;
    fake: number;
  };
  comments: Comment[];
  status?: 'fake' | 'not fake' | 'equal';
}

export interface VoteSummary {
  real: number;
  fake: number;
}

// 2. สร้าง Pinia Store ในรูปแบบ Setup Store
export const useNewsStore = defineStore('news', () => {
  // State: ใช้ ref()
  const allNews = ref<News[]>([]);

  // Getters: ใช้ computed()
  const getNewsById = computed(() => (id: number): News | undefined => {
    const newsItem = allNews.value.find((news) => news.id === id);
    if (!newsItem) return undefined;

    let calculatedStatus: 'fake' | 'not fake' | 'equal';
    if (newsItem.voteSummary.real > newsItem.voteSummary.fake) {
      calculatedStatus = 'not fake';
    } else if (newsItem.voteSummary.real < newsItem.voteSummary.fake) {
      calculatedStatus = 'fake';
    } else {
      calculatedStatus = 'equal';
    }

    return { ...newsItem, status: calculatedStatus };
  });

  const getNewsWithStatus = computed(() => (statusFilter: 'all' | 'fake' | 'not fake' | 'equal'): News[] => {
    const allNewsWithStatus = allNews.value.map((news) => {
      let calculatedStatus: 'fake' | 'not fake' | 'equal';
      if (news.voteSummary.real > news.voteSummary.fake) {
        calculatedStatus = 'not fake';
      } else if (news.voteSummary.real < news.voteSummary.fake) {
        calculatedStatus = 'fake';
      } else {
        calculatedStatus = 'equal';
      }

      return { ...news, status: calculatedStatus };
    });

    if (statusFilter === 'all') {
      return allNewsWithStatus;
    }
    return allNewsWithStatus.filter((news) => news.status === statusFilter);
  });

  // Actions: สร้างฟังก์ชันปกติ
  async function fetchNews() {
    try {
      const response = await apiClient.getNews();
      allNews.value = response.data;
    } catch (error) {
      console.error('Error fetching news:', error);
      allNews.value = [];
    }
  }

  function addCommentToNews(
    newsId: number,
    user: string,
    text: string,
    image: string | null,
    vote: 'real' | 'fake',
  ) {
    const newsItem = allNews.value.find((n) => n.id === newsId);
    if (!newsItem) {
      console.error('News item not found!');
      return;
    }

    const newCommentId =
      newsItem.comments.length > 0 ? Math.max(...newsItem.comments.map((c) => c.id)) + 1 : 1;

    const newComment: Comment = {
      id: newCommentId,
      user,
      text,
      image,
      time: new Date().toISOString(),
      vote,
    };

    newsItem.comments.push(newComment);

    if (vote === 'real') {
      newsItem.voteSummary.real++;
    } else {
      newsItem.voteSummary.fake++;
    }
  }

  // 3. return ทุกอย่างที่ต้องการให้ Component เรียกใช้ได้
  return { allNews, getNewsById, getNewsWithStatus, fetchNews, addCommentToNews };
});