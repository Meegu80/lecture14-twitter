// initializeApp: Firebase 앱을 초기화하는 함수
// 이 함수를 호출해야 Firebase의 모든 서비스를 사용할 수 있음
// FirebaseOptions: Firebase 설정 객체의 타입 정의
import { initializeApp, type FirebaseOptions } from "firebase/app";

// getAuth: Firebase Authentication 서비스에 접근하기 위한 함수
// 반환값: 인증 관련 기능(로그인, 회원가입 등)을 사용할 수 있는 auth 객체
import { getAuth } from "firebase/auth";

// getFirestore: Firebase Firestore(NoSQL 데이터베이스) 서비스에 접근하기 위한 함수
// 반환값: 데이터베이스에서 데이터를 읽고 쓸 수 있는 db 객체
import { getFirestore } from "firebase/firestore";

// getStorage: Firebase Storage(파일 저장소) 서비스에 접근하기 위한 함수
// 반환값: 이미지, 동영상 등의 파일을 업로드/다운로드할 수 있는 storage 객체
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

// firebaseConfig: Firebase 프로젝트에 연결하기 위한 설정 객체
// FirebaseOptions 타입으로 지정하여 필수 속성들을 보장
const firebaseConfig: FirebaseOptions = {
    // apiKey: Firebase 프로젝트의 API 키 (공개되어도 상관없지만 보안 규칙 설정 필요)
    // import.meta.env: Vite에서 환경변수에 접근하는 방법
    // VITE_API_KEY: .env 파일에 정의된 환경변수 이름
    apiKey: import.meta.env.VITE_API_KEY,

    // authDomain: Firebase Authentication에서 사용하는 도메인
    // 로그인 페이지 등이 이 도메인에서 호스팅됨
    // 형식: "프로젝트명.firebaseapp.com"
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,

    // projectId: Firebase 프로젝트의 고유 ID
    // Firebase Console에서 프로젝트를 생성할 때 자동으로 부여됨
    projectId: import.meta.env.VITE_PROJECT_ID,

    // storageBucket: Firebase Storage의 버킷(저장 공간) 주소
    // 파일 업로드/다운로드 시 이 버킷에 저장됨
    // 형식: "프로젝트명.appspot.com"
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,

    // messagingSenderId: Firebase Cloud Messaging(FCM)을 위한 발신자 ID
    // 푸시 알림 기능을 사용할 때 필요
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,

    // appId: Firebase 앱의 고유 식별자
    // 각 플랫폼(웹, iOS, Android)별로 다른 앱 ID가 부여됨
    appId: import.meta.env.VITE_APP_ID,
};

// Firebase 앱 초기화
// initializeApp(firebaseConfig): 위에서 정의한 설정으로 Firebase 앱 인스턴스 생성
// 이 app 객체를 통해 Firebase의 모든 서비스에 접근 가능
// 이 초기화는 앱 전체에서 딱 한 번만 실행되어야 함
const app = initializeApp(firebaseConfig);

// Firebase Authentication 서비스 인스턴스 생성 및 내보내기
// getAuth(app): 초기화된 Firebase 앱에서 인증 서비스를 가져옴
// 다른 파일에서 import { auth } from './firebase' 형태로 사용 가능
// 이 객체로 로그인, 로그아웃, 회원가입, 사용자 정보 관리 등을 수행
export const auth = getAuth(app);

// Firebase Firestore 데이터베이스 서비스 인스턴스 생성 및 내보내기
// getFirestore(app): 초기화된 Firebase 앱에서 Firestore 데이터베이스 서비스를 가져옴
// 다른 파일에서 import { db } from './firebase' 형태로 사용 가능
// 이 객체로 데이터 생성(Create), 읽기(Read), 수정(Update), 삭제(Delete) 수행
export const db = getFirestore(app);

// Firebase Storage 파일 저장소 서비스 인스턴스 생성 및 내보내기
// getStorage(app): 초기화된 Firebase 앱에서 Storage 서비스를 가져옴
// 다른 파일에서 import { storage } from './firebase' 형태로 사용 가능
// 이 객체로 이미지, 동영상, 문서 등의 파일을 업로드/다운로드/삭제 수행
export const storage = getStorage(app);
