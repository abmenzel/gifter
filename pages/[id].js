
export async function getStaticProps({ params }) {
    const url = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/api/test' : 'https://gavemanden.vercel.app/api/test'
    const res = await fetch(url)
    const data = await res.json()
    return {
      props: {
        data
      }
    }
  }

export async function getStaticPaths() {
    return {
      paths: [
        { params: { id: "vercel-test" } }
      ],
      fallback: true // false or 'blocking'
    };
  }

const Page = ({data}) => {
    return (
        <div>{data.text}</div>
    )
}

export default Page