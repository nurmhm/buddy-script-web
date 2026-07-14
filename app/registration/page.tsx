"use client";
import FormError from "@/components/ui/FormError";
import { useRegister } from "@/lib/queries/auth";
import { registerSchema,type TRegisterSchema } from "@/lib/schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";


const Registration = () => {
	const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<TRegisterSchema>({
  resolver: zodResolver(registerSchema),
});

const registerMutation = useRegister();
console.log(errors);

const onSubmit = (data: TRegisterSchema) => {
  registerMutation.mutate(data);
  console.log(data);

};


  return (
    <div>
      	<section className="_social_registration_wrapper _layout_main_wrapper">
		<div className="_shape_one">
			<img src="assets/images/shape1.svg" alt="" className="_shape_img"/>
			<img src="assets/images/dark_shape.svg" alt="" className="_dark_shape"/>
		</div>
		<div className="_shape_two">
			<img src="assets/images/shape2.svg" alt="" className="_shape_img"/>
			<img src="assets/images/dark_shape1.svg" alt="" className="_dark_shape _dark_shape_opacity"/>
		</div>
		<div className="_shape_three">
			<img src="assets/images/shape3.svg" alt="" className="_shape_img"/>
			<img src="assets/images/dark_shape2.svg" alt="" className="_dark_shape _dark_shape_opacity"/>
		</div>
		<div className="_social_registration_wrap">
			<div className="container">
				<div className="row align-items-center">
					<div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
						<div className="_social_registration_right">
							<div className="_social_registration_right_image">
								<img src="assets/images/registration.png" alt="Image" className="_right_img"/>
							</div>
							<div className="_social_registration_right_image_dark">
								<img src="assets/images/registration1.png" alt="Image" className="_right_img_dark"/>
							</div>
						</div>
					</div>
					<div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
						<div className="_social_registration_content">
							<div className="_social_registration_right_logo _mar_b28">
								<img src="assets/images/logo.svg" alt="Image" className="_right_logo"/>
							</div>
							<p className="_social_registration_content_para _mar_b8">Get Started Now</p>
							<h4 className="_social_registration_content_title _titl4 _mar_b50">Registration</h4>
							<button type="button" className="_social_registration_content_btn _mar_b40">
								<img src="assets/images/google.svg" alt="Image" className="_google_img"/> <span>Register with google</span>
							</button>
							<div className="_social_registration_content_bottom_txt _mar_b40"> <span>Or</span>
							</div>
							<form onSubmit={handleSubmit(onSubmit)} className="_social_registration_form">
								<div className="row">
										<div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
										<div className="_social_registration_form_input _mar_b14">
											<label className="_social_registration_label _mar_b8">First Name</label>
											<input type="text" className="form-control _social_registration_input" {...register("firstName")}/>
											<FormError message={errors.firstName?.message} />
										</div>
									</div>
										<div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
										<div className="_social_registration_form_input _mar_b14">
											<label className="_social_registration_label _mar_b8">Last Name</label>
											<input type="text" className="form-control _social_registration_input" {...register("lastName")}/>
											<FormError message={errors.lastName?.message} />
										</div>
									</div>
									<div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
										<div className="_social_registration_form_input _mar_b14">
											<label className="_social_registration_label _mar_b8">Email</label>
											<input type="email" className="form-control _social_registration_input" 
											{...register("email")}
											/>
											<FormError message={errors.email?.message} />
										</div>
									</div>
									<div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
										<div className="_social_registration_form_input _mar_b14">
											<label className="_social_registration_label _mar_b8">Password</label>
											<input type="password" className="form-control _social_registration_input" {...register("password")}/>
											<FormError message={errors.password?.message} />
										</div>
									</div>
									<div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
										<div className="_social_registration_form_input _mar_b14">
											<label className="_social_registration_label _mar_b8">Repeat Password</label>
											<input type="password" className="form-control _social_registration_input" {...register("repeatPassword")}/>
											<FormError message={errors.repeatPassword?.message} />
										</div>
									</div>
								</div>
								<div className="row">
									<div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
										<div className="form-check _social_registration_form_check">
											<input className="form-check-input _social_registration_form_check_input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked  />
											<label className="form-check-label _social_registration_form_check_label" htmlFor="flexRadioDefault2">I agree to terms & conditions</label>
										</div>
									</div>
								</div>
								<div className="row">
									<div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
										<div className="_social_registration_form_btn _mar_t40 _mar_b60">
											<button type="submit" className="_social_registration_form_btn_link _btn1">Register </button>
										</div>
									</div>
								</div>
							</form>
							<div className="row">
								<div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
									<div className="_social_registration_bottom_txt">
										<p className="_social_registration_bottom_txt_para">Dont have an account? <a href="/login">Login here</a>
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
    </div>
  )
}

export default Registration
