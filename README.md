# Güzellik Salonu - JWT Authentication Sistemi

Bu proje Next.js 15 ile geliştirilmiş ve JWT (JSON Web Token) tabanlı authentication sistemi kullanmaktadır.

## 🚀 Özellikler

- **Next.js 15** - En son Next.js sürümü
- **JWT Authentication** - Güvenli token tabanlı kimlik doğrulama
- **MongoDB** - Veritabanı
- **React Context** - Client-side state yönetimi
- **Tailwind CSS** - Modern UI tasarımı
- **TypeScript** - Tip güvenliği

## 🔐 JWT Authentication Sistemi

### Nasıl Çalışır?

1. **Login/Register**: Kullanıcı giriş yaptığında JWT token oluşturulur
2. **Token Storage**: Token hem cookie'de (httpOnly) hem de localStorage'da saklanır
3. **Client-side Access**: `useAuth` hook ile token'a ve kullanıcı bilgilerine erişim
4. **Server-side Verification**: API çağrılarında token doğrulanır

### Kullanım Örnekleri

#### 1. useAuth Hook Kullanımı

```jsx
import { useAuth } from '@/contexts/AuthContext'

function MyComponent() {
  const { user, token, login, logout } = useAuth()

  if (!user) {
    return <div>Lütfen giriş yapın</div>
  }

  return (
    <div>
      <h1>Hoş geldin, {user.firstName}!</h1>
      <p>Email: {user.email}</p>
      <button onClick={logout}>Çıkış Yap</button>
    </div>
  )
}
```

#### 2. Server Actions ile Authentication

```jsx
// lib/actions/auth.js
import { generateToken, verifyToken } from '@/lib/jwt'

export async function loginUser(data) {
  // ... kullanıcı doğrulama
  const token = generateToken({
    id: user._id.toString(),
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  })
  
  return { success: true, user, token }
}
```

#### 3. Protected Routes

```jsx
// Middleware veya component seviyesinde
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

function ProtectedPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  if (loading) return <div>Yükleniyor...</div>
  
  if (!user) {
    router.push('/login')
    return null
  }

  return <div>Korumalı içerik</div>
}
```

## 🛠️ Kurulum

1. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

2. **Environment dosyasını oluşturun:**
   ```bash
   cp env.example .env.local
   ```

3. **Environment değişkenlerini ayarlayın:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/beautySalon
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   ```

4. **Projeyi çalıştırın:**
   ```bash
   npm run dev
   ```

## 📁 Dosya Yapısı

```
├── contexts/
│   └── AuthContext.jsx          # JWT authentication context
├── lib/
│   ├── jwt.js                   # JWT utility fonksiyonları
│   ├── actions/
│   │   └── auth.js              # Authentication server actions
│   └── db.js                    # MongoDB bağlantısı
├── hooks/
│   └── useAuth.js               # useAuth hook re-export
├── components/
│   ├── header.jsx               # JWT-aware header
│   ├── mobile-nav.jsx           # JWT-aware mobile nav
│   └── user-profile.jsx         # Örnek kullanıcı profili
└── app/
    ├── login/page.jsx           # JWT login
    ├── register/page.jsx        # JWT register
    └── layout.jsx               # AuthProvider wrapper
```

## 🔧 JWT Token Yönetimi

### Token Oluşturma
```javascript
import { generateToken } from '@/lib/jwt'

const token = generateToken({
  id: user.id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName
})
```

### Token Doğrulama
```javascript
import { verifyToken } from '@/lib/jwt'

const decoded = verifyToken(token)
if (decoded) {
  // Token geçerli
  console.log(decoded.id, decoded.email)
}
```

### Token Decode (Client-side)
```javascript
import { decodeToken } from '@/lib/jwt'

const userInfo = decodeToken(token)
// Not: Bu sadece decode eder, doğrulamaz
```

## 🛡️ Güvenlik

- **JWT Secret**: Production'da güçlü bir secret kullanın
- **Token Expiration**: Token'lar 7 gün sonra expire olur
- **HttpOnly Cookies**: Server-side token güvenliği
- **LocalStorage**: Client-side hızlı erişim
- **Server Verification**: Her API çağrısında token doğrulanır

## 🚀 Production Deployment

1. **Environment Variables:**
   ```env
   JWT_SECRET=your-very-long-and-secure-secret-key
   MONGODB_URI=your-production-mongodb-uri
   NODE_ENV=production
   ```

2. **Build:**
   ```bash
   npm run build
   npm start
   ```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login` - Kullanıcı girişi
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/logout` - Kullanıcı çıkışı

### User Management
- `GET /api/user/profile` - Kullanıcı profili
- `PUT /api/user/profile` - Profil güncelleme

## 🔍 Debugging

### Token Kontrolü
```javascript
// Browser console'da
localStorage.getItem('auth_token')

// Component'te
const { token } = useAuth()
console.log('Current token:', token)
```

### User Bilgileri
```javascript
const { user } = useAuth()
console.log('Current user:', user)
```

## 📚 Ek Kaynaklar

- [JWT.io](https://jwt.io/) - JWT debugger
- [Next.js Authentication](https://nextjs.org/docs/authentication)
- [MongoDB Atlas](https://www.mongodb.com/atlas) - Cloud MongoDB

---

Bu sistem sayesinde kullanıcılar güvenli bir şekilde giriş yapabilir ve JWT token'ları ile kimlik doğrulama yapabilirler. Token'lar hem client-side hem de server-side olarak yönetilir ve güvenli bir authentication deneyimi sağlar. 