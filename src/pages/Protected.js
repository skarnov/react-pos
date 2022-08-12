import { useEffect } from 'react';

function Protected(props) {
    let Page = props.page;
    useEffect(() => {
        if(!localStorage.getItem('user-info')){

        }
    })

  return (
    <>
      <Page/>
    </>
  );
}

export default Protected;