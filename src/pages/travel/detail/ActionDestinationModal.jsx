import { editTrip } from '@/api/travelApi';
import FormError from '@/components/form/FormError';
import CustomModal from '@/components/modal';
import useCustomToast from '@/hooks/useCustomToast';
import { Button, FormControl, Input, Textarea } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import moment from 'moment';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const addSchema = yup.object({
    name: yup.string().required('Trip is required'),
    startDate: yup.string().required('Date is required'),
    endDate: yup.string().nullable().optional(),
    map_url: yup.string().nullable().optional(),
    images: yup.string().nullable().optional(),
    description: yup.string().required('Description is required'),
});

const editSchema = yup.object({
    name: yup.string().required(`Trip is required`),
    startDate: yup.string().required('Date is required'),
    endDate: yup.string().nullable().optional(),
    images: yup.string().nullable().optional(),
});

const ActionDestinationModal = ({ isOpen, onClose, refetchItems, editData, isEdit }) => {
    const showToast = useCustomToast();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        // mutationFn: isEdit ? editTrip : addDestination,
        mutationFn: editTrip,
        onSuccess: (data) => {
            const { message } = data;
            showToast(message, null, 'bottom');
            // refetchItems();
            queryClient.invalidateQueries(['detail_destination', editData?._id]);
            // queryClient.invalidateQueries('list_destination');
            onClose();
        },
        onError: (error, variables, context) => {
            const errMsg = error.response?.data?.message || error.message;
            alert(errMsg);
            showToast(errMsg, 'error', 'bottom');
        },
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm({
        reValidateMode: 'onChange',
        resolver: yupResolver(isEdit ? editSchema : addSchema),
    });

    useEffect(() => {
        if (editData && isEdit) {
            setValue('name', editData.name);
            setValue('startDate', moment(editData.startDate).format('YYYY-MM-DD'));
            setValue('endDate', moment(editData?.endDate).format('YYYY-MM-DD'));
            setValue('images', editData.image);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editData, isEdit]);

    // const { fields } = useFieldArray({
    // 	control,
    // 	name: 'images',
    // });

    const onSubmit = (data) => {
        if (isEdit) {
            const startDate = new Date(data.startDate);

            const submitData = {
                name: data.name,
                startDate: startDate.getTime(),
                images: data.images,
            };

            if (data.endDate) {
                submitData.endDate = new Date(data.endDate).getTime();
            }

            mutation.mutate({
                id: editData._id,
                data: submitData,
            });
        } else {
            // Add destination
            mutation.mutate({
                id: editData._id,
                data: {
                    destination: data,
                    action: 'add',
                },
            });
        }
    };

    return (
        <CustomModal title={isEdit ? 'Edit trip' : 'Add new destination'} isOpen={isOpen} onClose={onClose} className='!max-w-[600px]'>
            {isEdit ? (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='mb-10'>
                        <FormControl className='my-2'>
                            <Input
                                name='name'
                                className='!text-sm'
                                isInvalid={Boolean(errors['name'])}
                                errorBorderColor='red.500'
                                {...register('name')}
                                placeholder={`Destination`}
                            />
                            <FormError message={errors['name']?.message} />
                        </FormControl>
                        <FormControl className='my-2'>
                            <Input
                                name='startDate'
                                className='!text-sm'
                                isInvalid={Boolean(errors['startDate'])}
                                errorBorderColor='red.500'
                                placeholder='Start date'
                                type='date'
                                {...register('startDate')}
                            />
                            <FormError message={errors['date']?.message} />
                        </FormControl>
                        <FormControl className='my-2'>
                            <Input
                                name='endDate'
                                className='!text-sm'
                                errorBorderColor='red.500'
                                placeholder='End date'
                                type='date'
                                {...register('endDate')}
                            />
                        </FormControl>
                        <FormControl className='my-2'>
                            <Input
                                name='images'
                                className='!text-sm'
                                isInvalid={Boolean(errors['images'])}
                                errorBorderColor='red.500'
                                placeholder='Image url'
                                {...register('images')}
                            />
                        </FormControl>
                    </div>
                    <Button type='submit' className='w-full !bg-primary !text-white !text-base' disabled={mutation.isLoading}>
                        Edit
                    </Button>
                </form>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='mb-10'>
                        <FormControl className='my-2'>
                            <Input
                                name='name'
                                className='!text-sm'
                                isInvalid={Boolean(errors['name'])}
                                errorBorderColor='red.500'
                                {...register('name')}
                                placeholder={`Destination`}
                            />
                            <FormError message={errors['name']?.message} />
                        </FormControl>
                        <FormControl className='my-2'>
                            <Input
                                name='date'
                                className='!text-sm'
                                isInvalid={Boolean(errors['date'])}
                                errorBorderColor='red.500'
                                placeholder='Date'
                                type='date'
                                {...register('date')}
                            />
                            <FormError message={errors['date']?.message} />
                        </FormControl>
                        <FormControl className='my-2'>
                            <Input
                                name='time'
                                className='!text-sm'
                                isInvalid={Boolean(errors['time'])}
                                errorBorderColor='red.500'
                                placeholder='Start time'
                                type='time'
                                {...register('time')}
                            />
                            <FormError message={errors['time']?.message} />
                        </FormControl>
                        <FormControl className='my-2'>
                            <Textarea
                                name='description'
                                className='!text-sm'
                                isInvalid={Boolean(errors['description'])}
                                errorBorderColor='red.500'
                                placeholder='Description'
                                {...register('description')}
                            />
                            <FormError message={errors['description']?.message} />
                        </FormControl>
                        <FormControl className='my-2'>
                            <Input
                                name='images'
                                className='!text-sm'
                                isInvalid={Boolean(errors['images'])}
                                errorBorderColor='red.500'
                                placeholder='Image'
                                {...register('images')}
                            />
                        </FormControl>
                        <FormControl className='my-2'>
                            <Input
                                name='map_url'
                                className='!text-sm'
                                isInvalid={Boolean(errors['map_url'])}
                                errorBorderColor='red.500'
                                placeholder='Map url'
                                {...register('map_url')}
                            />
                        </FormControl>
                    </div>
                    <Button type='submit' className='w-full !bg-primary !text-white !text-base' disabled={mutation.isLoading}>
                        Add
                    </Button>
                </form>
            )}
        </CustomModal>
    );
};

export default ActionDestinationModal;
