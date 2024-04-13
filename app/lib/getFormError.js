export default function getFormError(errors, path) {
    if (!Array.isArray(errors)) {
        return null; // if errors is empty
    }

    const error = errors.find(err => err.path === path);
    return error ? <p className='text-red-800'>{error.message}</p> : null;
}