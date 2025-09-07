import {
  Scale,
  ArrowRight,
  Home,
  FileText,
  Users,
  Shield,
  Building,
  Gavel,
  Handshake,
  Briefcase,
  Landmark,
  FileCheck,
  UserCheck,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Clock,
  CheckCircle,
  Star,
  Award,
  Target,
  Zap
} from 'lucide-react';
import { MotionWrapper } from '@/Components';
import { Link } from '@inertiajs/react';

// Array of icons to randomly assign to services
const serviceIcons = [
  Scale, Home, FileText, Users, Shield, Building, Gavel,
  Handshake, Briefcase, Landmark, FileCheck, UserCheck,
  DollarSign, MapPin, Phone, Mail, Calendar, Clock,
  CheckCircle, Star, Award, Target, Zap
];

// Function to get a consistent icon for a service based on its ID
const getServiceIcon = (serviceId) => {
  const iconIndex = serviceId % serviceIcons.length;
  return serviceIcons[iconIndex];
};

export const CardService = ({ id, name, description, picture, slug }) => {
  const IconComponent = getServiceIcon(id);

  return (
    <Link href={`/servicios/${slug || id}`}>
      <article className="flex flex-col items-center justify-between h-full min-h-[320px] p-8 text-center transition-all duration-300 border cursor-pointer border-softGrey hover:shadow-lg hover:border-golden hover:scale-105 lg:p-16 lg:min-h-[380px] group">
        <div className="flex flex-col items-center flex-grow">
          <div className="transition-colors duration-300 group-hover:text-golden">
            <IconComponent className="w-16 h-16 text-golden lg:w-20 lg:h-20" />
          </div>
          <h3 className="mt-4 text-lg font-semibold tracking-wider text-gray-800 font-prata lg:text-xl group-hover:text-golden transition-colors duration-300">
            {name}
          </h3>
          <p className="mt-2 text-sm text-greyki lg:text-base flex-grow flex items-center justify-center" style={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: '1.4',
            minHeight: '4.2em'
          }}>
            {description}
          </p>
        </div>
        <div className='p-3 mx-auto mt-4 bg-softGrey group-hover:bg-golden transition-colors duration-300 lg:p-4 lg:mt-6'>
          <ArrowRight className="w-6 h-6 text-golden group-hover:text-white transition-colors duration-300" />
        </div>
      </article>
    </Link>
  )
}
