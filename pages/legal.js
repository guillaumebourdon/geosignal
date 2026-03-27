import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Legal() {
  const router = useRouter();
  useEffect(() => { router.replace('/mentions-legales'); }, []);
  return null;
}
