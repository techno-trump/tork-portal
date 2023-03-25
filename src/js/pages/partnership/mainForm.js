import yup from "yup";
import { attachFormValidator, ERROR_REQUIRED, ERROR_NEGATIVE, ERROR_INCORRECT } from "../../libs/formValidator";

export default function() {
	// Schema example
	const rawSchema = {
		"country": yup.required(ERROR_REQUIRED),
		"name": yup.required(ERROR_REQUIRED),
		"phone": yup.required(ERROR_REQUIRED).phone(),
	}
	const schema = yup.object(rawSchema);
	attachFormValidator("#form", Object.keys(rawSchema), schema);
}