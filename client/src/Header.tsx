function Header(){
    return(
        <header className="p-6" >
            <h1 className="text-4xl text-center font-bold"> My Website</h1>
            <nav className="bg-blue-800 p-6">
                <button className="bg-red-500 text-2xl text-white mx-3">Home</button>
                <button className="text-2xl mx-3">Inscription</button>
                <button className="text-2xl mx-3">Help</button>
                <button className="text-2xl mx-3">Contact</button>
                
            </nav>
            <hr></hr>
        </header>
    );
}

export default Header

//padding = p-1 1 = 0.25 rem si jamais px ou py pour largeur hauteur. lrtb pour haut bas etc. margin cest just m
