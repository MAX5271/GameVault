function Footer() {

    const year = new Date().getFullYear();

  return (
    <footer className="Footer" >
      GameVault, {year}
    </footer>
  )
}

export default Footer