import { useState, useEffect } from 'react';
import { 
  onSnapshot, 
  collection, 
  query, 
  orderBy, 
  limit, 
  addDoc, 
  updateDoc, 
  doc, 
  getDoc, 
  setDoc,
  where
} from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db, handleFirestoreError, OperationType } from './lib/firebase';
import { 
  UserProfile, 
  UserRole, 
  Complaint, 
  PenaltyPointRecord, 
  SleepoutApplication, 
  LaundryMachine, 
  DailyMenu, 
  Announcement, 
  Post 
} from './types';

import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Complaints from './components/Complaints';
import PenaltyPoints from './components/PenaltyPoints';
import SleepoutForm from './components/SleepoutForm';
import LaundryRoom from './components/LaundryRoom';
import CafeteriaMenu from './components/CafeteriaMenu';
import Community from './components/Community';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Data states
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [penaltyRecords, setPenaltyRecords] = useState<PenaltyPointRecord[]>([]);
  const [sleepouts, setSleepouts] = useState<SleepoutApplication[]>([]);
  const [laundryMachines, setLaundryMachines] = useState<LaundryMachine[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  // Auth Effect
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Try to get existing profile
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setUser({ uid: firebaseUser.uid, ...userDoc.data() } as UserProfile);
          } else {
            // Create new student profile if not exists (Demo purpose)
            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || '학생',
              studentId: '2023' + Math.floor(1000 + Math.random() * 9000),
              dormRoom: '제1관 302호',
              role: UserRole.STUDENT,
              penaltyPoints: 0, // Rules require 0 on create
              createdAt: new Date().toISOString()
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), newProfile);
            setUser(newProfile);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth state error:', error);
        // If it's a permission error, it might be due to rules - sign out to allow retry
        await signOut(auth);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const [menus, setMenus] = useState<DailyMenu[]>([]);

  // Data Fetching Effect
  useEffect(() => {
    if (!user) return;

    // Menus
    const qMenus = query(collection(db, 'menus'), orderBy('date', 'asc'));
    const unsubMenus = onSnapshot(qMenus, (snapshot) => {
      setMenus(snapshot.docs.map(d => ({ date: d.id, ...d.data() } as DailyMenu)));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'menus');
    });

    // Complaints
    const qComplaints = user.role === UserRole.ADMIN 
      ? query(collection(db, 'complaints'), orderBy('createdAt', 'desc'))
      : query(collection(db, 'complaints'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));

    const unsubComplaints = onSnapshot(qComplaints, (snapshot) => {
      setComplaints(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Complaint)));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'complaints');
    });

    // Laundry
    const qLaundry = query(collection(db, 'laundry'));
    const unsubLaundry = onSnapshot(qLaundry, (snapshot) => {
      if (snapshot.empty && user.role === UserRole.ADMIN) {
        // Initialize laundry machines if they don't exist
        const initial = [
          { type: 'washer', machineIndex: 1, status: 'available' },
          { type: 'washer', machineIndex: 2, status: 'available' },
          { type: 'washer', machineIndex: 3, status: 'available' },
          { type: 'dryer', machineIndex: 1, status: 'available' },
        ];
        initial.forEach(async (m, i) => {
          await setDoc(doc(db, 'laundry', `machine_${i}`), m);
        });
      }
      setLaundryMachines(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as LaundryMachine)));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'laundry');
    });

    // Announcements
    const qAnnouncements = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'), limit(5));
    const unsubAnnouncements = onSnapshot(qAnnouncements, (snapshot) => {
      setAnnouncements(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Announcement)));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'announcements');
    });

    // Posts
    const qPosts = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubPosts = onSnapshot(qPosts, (snapshot) => {
      setPosts(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Post)));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'posts');
    });

    // Penalty Records
    const qPenalty = user.role === UserRole.ADMIN
      ? query(collection(db, 'penalty_points'), orderBy('date', 'desc'))
      : query(collection(db, 'penalty_points'), where('userId', '==', user.uid), orderBy('date', 'desc'));

    const unsubPenalty = onSnapshot(qPenalty, (snapshot) => {
      setPenaltyRecords(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as PenaltyPointRecord)));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'penalty_points');
    });

    // Sleepouts
    const qSleepouts = user.role === UserRole.ADMIN
      ? query(collection(db, 'sleepouts'), orderBy('createdAt', 'desc'))
      : query(collection(db, 'sleepouts'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));

    const unsubSleepouts = onSnapshot(qSleepouts, (snapshot) => {
      setSleepouts(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as SleepoutApplication)));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'sleepouts');
    });

    return () => {
      unsubComplaints();
      unsubLaundry();
      unsubAnnouncements();
      unsubPosts();
      unsubPenalty();
      unsubSleepouts();
      unsubMenus();
    };
  }, [user]);

  const handleLogout = () => signOut(auth);

  const handleUpdateLaundry = async (id: string, updates: Partial<LaundryMachine>) => {
    try {
      await updateDoc(doc(db, 'laundry', id), updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `laundry/${id}`);
    }
  };

  const handleCreateComplaint = async (data: Partial<Complaint>) => {
    try {
      await addDoc(collection(db, 'complaints'), { ...data, userId: user?.uid });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'complaints');
    }
  };

  const handleCreatePost = async (data: Partial<Post>) => {
    try {
      await addDoc(collection(db, 'posts'), { ...data, authorName: user?.name });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'posts');
    }
  };

  const handleCreateSleepout = async (data: Partial<SleepoutApplication>) => {
    try {
      await addDoc(collection(db, 'sleepouts'), { ...data, userId: user?.uid });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'sleepouts');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#004b93] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          <p className="text-white font-medium">Hallym Dorm 로딩중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLoginSuccess={() => setLoading(true)} />;
  }

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      userRole={user.role}
      userName={user.name}
      onLogout={handleLogout}
    >
      {activeTab === 'dashboard' && (
        <Dashboard 
          user={user} 
          laundryStatus={laundryMachines}
          nextMenu={menus.length > 0 ? menus[0] : null}
          announcements={announcements}
          onNavigate={setActiveTab}
        />
      )}
      {activeTab === 'complaints' && (
        <Complaints complaints={complaints} onSubmit={handleCreateComplaint} />
      )}
      {activeTab === 'points' && (
        <PenaltyPoints records={penaltyRecords} totalPoints={user.penaltyPoints} />
      )}
      {activeTab === 'sleepout' && (
        <SleepoutForm applications={sleepouts} onSubmit={handleCreateSleepout} />
      )}
      {activeTab === 'menu' && (
        <CafeteriaMenu menus={menus} />
      )}
      {activeTab === 'laundry' && (
        <LaundryRoom 
          machines={laundryMachines} 
          onUpdateMachine={handleUpdateLaundry}
          currentUserId={user.uid}
        />
      )}
      {activeTab === 'community' && (
        <Community 
          posts={posts} 
          onCreatePost={handleCreatePost}
          onAddComment={() => {}}
          currentUserId={user.uid}
          userName={user.name}
        />
      )}
    </Layout>
  );
}
