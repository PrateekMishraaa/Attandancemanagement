import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const Profile = () => {
    const usertoken = localStorage.getItem('token')
    console.log('user details',usertoken)
    const [userData,setUserData]=useState("")
    console.log('dataaaa',userData)


    useEffect(()=>{
        const fetchUserTokenDetails=async()=>{
            try{
                if(usertoken){
                    const data = jwtDecode(usertoken)  
                    console.log('this is data for profile',data) 
                    setUserData(data)
                }
            }catch(error){
                console.log('error',error)
            }
        }
        fetchUserTokenDetails()
    },[])

  return (
    <>
      
      <div style={styles.container}>
     
        <div style={styles.coverSection}>
          <div style={styles.coverImage}></div>
          <div style={styles.avatarContainer}>
            <div style={styles.avatar}>
              <span style={styles.avatarText}>JD</span>
            </div>
          </div>
        </div>

        <div style={styles.infoSection}>
          <h1 style={styles.name}>{userData.name}</h1>
          <p style={styles.username}>{userData.email}</p>
          <p style={styles.bio}>
            {userData.department}
          </p>
         
        </div>

     
        <div style={styles.detailsCard}>
          <div style={styles.detailRow}>
            <span style={styles.detailIcon}>📧</span>
            <div>
              <div style={styles.detailLabel}>Email</div>
              <div style={styles.detailValue}>{userData.email}</div>
            </div>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailIcon}>📍</span>
            <div>
              <div style={styles.detailLabel}>Number</div>
              <div style={styles.detailValue}>{userData.number}</div>
            </div>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailIcon}>🎂</span>
            <div>
              <div style={styles.detailLabel}>EmployeeId</div>
              <div style={styles.detailValue}>{userData.employeeId}</div>
            </div>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailIcon}>🌐</span>
            <div>
              <div style={styles.detailLabel}>Website</div>
              <div style={styles.detailValue}>johndoe.dev</div>
            </div>
          </div>
        </div>

   
        <div style={styles.buttonGroup}>
          <button style={styles.primaryBtn}>Edit Profile</button>
          <button style={styles.secondaryBtn}>Share Profile</button>
        </div>

        
        <div style={styles.tabsContainer}>
          <button style={styles.activeTab}>Posts</button>
          <button style={styles.tab}>Photos</button>
          <button style={styles.tab}>Saved</button>
        </div>

 
        <div style={styles.postsGrid}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} style={styles.postCard}>
              <div style={styles.postPlaceholder}>
                <span>📝</span>
              </div>
              <div style={styles.postTitle}>Post Title {item}</div>
              <div style={styles.postExcerpt}>
                This is a sample post description...
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    width: '100%',
    background: '#132b4f',
    padding: '0 0 2rem 0',
  },
  coverSection: {
    position: 'relative',
    width: '100%',
    height: '180px',
    background: '#1a3a66',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, #2a5298, #1e3c72)',
  },
  avatarContainer: {
    position: 'absolute',
    bottom: '-50px',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  avatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    background: '#f0a500',
    border: '4px solid #132b4f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#132b4f',
  },
  infoSection: {
    marginTop: '60px',
    textAlign: 'center',
    padding: '0 20px',
  },
  name: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#ffffff',
    margin: '0 0 5px 0',
  },
  username: {
    fontSize: '1rem',
    color: '#a0c0e0',
    margin: '0 0 12px 0',
  },
  bio: {
    fontSize: '0.95rem',
    color: '#c0d8f0',
    margin: '0 0 20px 0',
    maxWidth: '400px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  stats: {
    display: 'flex',
    justifyContent: 'center',
    gap: '40px',
    marginBottom: '30px',
  },
  statItem: {
    textAlign: 'center',
  },
  statValue: {
    display: 'block',
    fontSize: '1.4rem',
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: '0.8rem',
    color: '#a0c0e0',
  },
  detailsCard: {
    background: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    padding: '20px',
    margin: '0 20px 20px 20px',
    backdropFilter: 'blur(10px)',
  },
  detailRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '12px 0',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  detailIcon: {
    fontSize: '1.5rem',
    width: '40px',
  },
  detailLabel: {
    fontSize: '0.7rem',
    color: '#a0c0e0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  detailValue: {
    fontSize: '0.95rem',
    color: '#ffffff',
    marginTop: '2px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '15px',
    padding: '0 20px',
    marginBottom: '30px',
  },
  primaryBtn: {
    flex: 1,
    padding: '12px',
    background: '#f0a500',
    border: 'none',
    borderRadius: '30px',
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#132b4f',
    cursor: 'pointer',
  },
  secondaryBtn: {
    flex: 1,
    padding: '12px',
    background: 'transparent',
    border: '1px solid #f0a500',
    borderRadius: '30px',
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#f0a500',
    cursor: 'pointer',
  },
  tabsContainer: {
    display: 'flex',
    gap: '0',
    borderBottom: '1px solid rgba(255,255,255,0.2)',
    margin: '0 20px 20px 20px',
  },
  activeTab: {
    flex: 1,
    padding: '12px',
    background: 'transparent',
    border: 'none',
    color: '#f0a500',
    fontSize: '0.95rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    borderBottom: '2px solid #f0a500',
  },
  tab: {
    flex: 1,
    padding: '12px',
    background: 'transparent',
    border: 'none',
    color: '#a0c0e0',
    fontSize: '0.95rem',
    cursor: 'pointer',
  },
  postsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
    padding: '0 20px',
  },
  postCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    padding: '15px',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
  },
  postPlaceholder: {
    height: '140px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    marginBottom: '12px',
  },
  postTitle: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: '6px',
  },
  postExcerpt: {
    fontSize: '0.8rem',
    color: '#a0c0e0',
  },
};

export default Profile;