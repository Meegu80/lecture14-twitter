import { initializeApp, type FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// firebase 접속 정보

// environment
// 환경변수 : 어떠한 프로그램을 실행을 할 때 필요한 정보를 입력해주는 것
// 환경변수를 파일로 관리할 때의 파일명
// 1. .env               // 통합 파일
// 2. .env.local         // 내 컴퓨터에서만 돌릴 목적으로 작성
// 3. .env.development   // 개발 단계에서 사용하는 env
// 4. .env.production    // 프로덕션 단계에서 사용하는 env

// !! VITE !! 에서 사용하는 방법
// .env에 키를 "VITE_" 를 붙여서 써줘야만 vite 환경에서 불러올 수 있음
// 사용처에서는 "import.meta.env.VITE_어쩌구" 를 통해 사용 가능

const firebaseConfig: FirebaseOptions = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);