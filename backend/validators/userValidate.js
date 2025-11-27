import * as yup from "yup";

export const userSchema = yup.object().shape({
    username: yup.string().min(3).max(30).required("Username is required"),
    email: yup.string().email().required("Email is required"),
    password: yup.string().min(6).max(20).required("Password must be 6 to 20 characters long")
});

// middleware factory: validate request body against the provided schema
export const validateUser = (schema) => (req, res, next) => {
    try {
        schema.validateSync(req.body, { abortEarly: false });
        return next();
    } catch (err) {
        const errors = err.inner ? err.inner.map((e) => e.message) : [err.message];
        return res.status(400).json({ success: false, errors });
    }
};