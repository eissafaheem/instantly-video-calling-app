import React from 'react'
import brandLogo from '../../../assets/brand-logo.svg'
import LandingStyles from './LandingPage.module.css'
import illustration from '../../../assets/landing-page-illustration.svg'
import ButtonComponent from '../../components/button/Button.component'
import { useLandingPageHook } from './LandingPage.hook'
import InputComponent from '../../components/input/Input.component'
import ToasterComponent from '../../components/toaster/Toaster.component'

function LandingPageComponent() {

  const {
    setRoomId,
    handleJoinRoom,
    isToasterVisible,
    toasterMessage,
    setIsToasterVisible,
    handleCreateRoom
  } = useLandingPageHook();

  return (
    <div className={LandingStyles['landing-main-container']}>
      <header>
        <img src={brandLogo} alt="Brand Logo" />
        <h1>
          Instantly
        </h1>
      </header>
      <div className={LandingStyles["content"]}>
        <div className={LandingStyles["brand-info"]}>
          <div>
            <h1>
              Create or Join <br /> Instant video meetings <br /> in seconds with Instantly
            </h1>
            <p>Revolutionary video calling app. <br /> With instantly, you ‘ll never have to wait for leanthy,  <br /> signing process in time of urgency.</p>
          </div>
          <div className={LandingStyles["functionalities"]}>
            <ButtonComponent text='Create' type='primary' onClick={handleCreateRoom} />
            <form className={LandingStyles['meeting-form']} onSubmit={(event: React.FormEvent) => { handleJoinRoom(event) }}>
              <InputComponent placeholder='Enter meeting code' setValue={setRoomId} type='text' />
              <ButtonComponent text='Join' type='secondary' />
            </form>
          </div>
        </div>
        <img src={illustration} className={LandingStyles['illustration']} alt="Video calling" />
      </div>
      {
        isToasterVisible &&
        <ToasterComponent message={toasterMessage}
          setIsToasterVisible={setIsToasterVisible} />
      }
    </div>
  )
}

export default LandingPageComponent
