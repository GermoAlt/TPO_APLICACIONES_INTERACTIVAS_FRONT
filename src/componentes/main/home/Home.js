import Banner from "./banner/Banner";

export default function Home() {
    return (
        <div> 
            <div>
                <Banner isGuest={false}/>
                {/*<h1>
                    si lees esto, el proyecto levantó :)
                </h1>
                <h2>
                    este texto esta en la home (Home.js)
                </h2>*/}
            </div>
        </div>
    )
}