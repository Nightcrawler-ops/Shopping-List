
function Footer(){
    return(
        <>
        <hr />
        <p>Developed by <b>Ayotech</b> &copy; {new Date().getFullYear()}</p>
        <p>Contact Us:</p>
            <a href="https://www.linkedin.com/in/ayotech/" target="_blank" rel="Linkedin">
            <img className="icon" src="../src/assets/linkedin.png" />
            </a>
            <a href="https://www.tiktok.com/@ayotech_" target="_blank">
            <img className="icon" src="../src/assets/tiktok-color-icon.svg" alt="Tiktok Page"/>
            </a>
            <a href="https://wa.me/+2347063788674" target="_blank">
            <img className="icon" src="../src/assets/whatsapp.png" alt="Whatsapp"/>
            </a>     
        </>
    );
}

export default Footer