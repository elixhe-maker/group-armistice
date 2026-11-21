/* Westworld theme: user confirms permission. Stream from the linked Internet Archive item. */
(()=>{
 const toggle=document.getElementById('sound-toggle'),input=document.getElementById('sound-file'),status=document.getElementById('sound-status');
 if(!toggle)return;
 const audio=new Audio(); audio.loop=true;audio.preload='auto';audio.volume=.32;
 const source='https://archive.org/download/tvtunes_32465/Westworld.mp3';
 const local='assets/westworld-theme.mp3';
 let objectURL=null,usingLocal=false;
 audio.src=source;
 const key='armistice-sound-state',timeKey='armistice-sound-position';
 const saved=sessionStorage.getItem(key);
 function ui(){toggle.textContent=audio.paused?'♫ PLAY THEME':'♫ PAUSE THEME';toggle.setAttribute('aria-pressed',String(!audio.paused));}
 function msg(s){status.textContent=s;}
 async function play(){try{await audio.play();sessionStorage.setItem(key,'playing');msg('WESTWORLD · THEME PLAYING');}catch(e){msg('Tap PLAY THEME to enable audio');}ui();}
 function pause(){audio.pause();sessionStorage.setItem(key,'paused');msg('SOUNDTRACK PAUSED');ui();}
 toggle.addEventListener('click',()=>audio.paused?play():pause());
 input.addEventListener('change',()=>{const f=input.files?.[0];if(!f)return;if(objectURL)URL.revokeObjectURL(objectURL);objectURL=URL.createObjectURL(f);audio.src=objectURL;msg(f.name);play();});
 audio.addEventListener('loadedmetadata',()=>{const t=Number(sessionStorage.getItem(timeKey)||0);if(t>0&&Number.isFinite(audio.duration)&&t<audio.duration){try{audio.currentTime=t}catch(e){}}});
 audio.addEventListener('timeupdate',()=>{if(!audio.paused)sessionStorage.setItem(timeKey,String(audio.currentTime));});
 audio.addEventListener('error',()=>{if(!usingLocal&&!objectURL){usingLocal=true;audio.src=local;msg('Online stream unavailable · add assets/westworld-theme.mp3');}else msg('Audio unavailable · select an authorized local file');ui();});
 // Autoplay is attempted on initial entry. Browser policies may require a gesture.
 if(saved!=='paused')play();else{msg('WESTWORLD · THEME READY');ui();}
 // A deliberate click on the opening portal is a valid gesture for audio playback.
 document.getElementById('skip-intro')?.addEventListener('click',()=>{if(audio.paused&&sessionStorage.getItem(key)!=='paused')play()});
 document.addEventListener('click',e=>{if(e.target.closest('a,button')&&e.target!==toggle&&audio.paused&&sessionStorage.getItem(key)!=='paused')play()},{once:true});
 window.addEventListener('pagehide',()=>{if(!audio.paused)sessionStorage.setItem(timeKey,String(audio.currentTime));});
 ui();
})();
