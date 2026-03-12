'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 유효성 검사
    if (!email) {
      setError('이메일을 입력하세요');
      return;
    }
    if (!password || password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다');
      return;
    }
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        // 회원가입 성공 → /welcome으로 이동
        router.push('/welcome');
      }
    } catch (err) {
      setError('회원가입 중 오류가 발생했습니다');
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      {/* 헤더 */}
      <div className="p-4">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            돌아가기
          </Button>
        </Link>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex items-center justify-center px-4 pb-20 md:pb-0">
        <div className="w-full max-w-md">
          {/* 로고 */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg mb-4">
              <Heart className="w-8 h-8 text-white fill-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              회원가입
            </h1>
            <p className="text-gray-500 mt-2">MarryRoad와 함께 시작하세요</p>
          </div>

          {/* 폼 */}
          <form onSubmit={handleSignUp} className="space-y-4">
            {/* 에러 메시지 */}
            {error && (
              <div className="p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* 이메일 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                이메일
              </label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full"
              />
            </div>

            {/* 비밀번호 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                비밀번호
              </label>
              <Input
                type="password"
                placeholder="6자 이상"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full"
              />
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                비밀번호 확인
              </label>
              <Input
                type="password"
                placeholder="비밀번호 재입력"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                className="w-full"
              />
            </div>

            {/* 가입 버튼 */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? '가입 중...' : '가입하기'}
            </Button>
          </form>

          {/* 로그인 링크 */}
          <p className="text-center text-gray-600 dark:text-gray-400 mt-6 text-sm">
            이미 계정이 있으신가요?{' '}
            <Link
              href="/login"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
