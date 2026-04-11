import { Typewriter } from "react-simple-typewriter";
import Swal from "sweetalert2";
import { NODE_API_BASE_URL } from "../../config/api";
// import FeedbackPart from "./FeedbackPart";

const FeedbackK = () => {
  const handleType = (count) => {
    console.log(count);
  };

  const handleDone = () => {
    console.log(`Typewriter animation done!`);
  };

  const handlePost = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const exp = form.exp.value;
    const feedbackPost = { name, exp };
    console.log(feedbackPost);

    // send feedback to the server
    fetch(`${NODE_API_BASE_URL}/feedback`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(feedbackPost),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.insertedId) {
          Swal.fire({
            title: "Thank you!",
            text: `${name} for your valuable feedback :3`,
            icon: "success",
            confirmButtonText: "Cool",
          });
        }
        form.reset();
      });
  };
  return (
    <div className='pb-12'>
      <div
        className="relative lg:w-full bg-[url('https://i.ibb.co/HPWNL44/photo-1645846673812-c68f52871d06.jpg')] bg-center bg-cover h-[400px] md:min-h-screen flex items-center"
        style={{
          backgroundImage: `linear-gradient(0deg, rgba(21, 11, 43, 0.9), rgba(21, 11, 43, 0) 100%), url('https://i.ibb.co/HPWNL44/photo-1645846673812-c68f52871d06.jpg')`,
        }}>
        <div className='lg:max-w-[923px] mx-auto text-white text-center'>
          {/* <h1>Total Feedback: {feedback.length}</h1> */}
          <h1
            style={{ fontFamily: "Bree Serif" }}
            className=' font-bold lg:text-[49px] bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-cyan-200'>
            Give us your Valuable Suggestions!
          </h1>
          <Typewriter
            words={["Your Suggestions", "Our Priority"]}
            loop={true}
            cursor
            cursorStyle='_'
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={1000}
            onLoopDone={handleDone}
            onType={handleType}
          />
          <form
            onSubmit={handlePost}
            className='flex flex-col md:flex-row gap-4 justify-center mt-5'>
            <div className=' flex flex-col md:flex-row gap-y-3 md:gap-x-4 '>
              <input
                name='name'
                type='text'
                placeholder='Your Name'
                className='input join-item text-black'
              />
              <input
                name='exp'
                type='text'
                placeholder='Your Experience..'
                className='input join-item text-black '
              />
              <input
                className='btn bg-[#33a978] join-item border-none rounded-lg'
                type='submit'
                value='Send'
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeedbackK;
